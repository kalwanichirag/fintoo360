#!/usr/bin/env python3
import base64, json, subprocess, sys, tempfile, time
from pathlib import Path
import requests, websocket
from PIL import Image, ImageStat

PAGES = [
 "financial-advice", "financial-planning", "financial-planning-services", "investment-planning",
 "investmentplanning", "investment-strategy", "personal-financial-planning",
 "portfolio-management-services", "retirement-planner", "retirement-planning",
 "wealth-management-for-indians-and-nri", "wealth-management-for-nri-hni",
 "financial-planning-strategy", "financial-strategy", "investment-advice",
 "personal-financial-strategy", "retirement-strategy",
 "wealth-management-strategy-for-indians-and-nri", "itr-filing-corporate",
 "private-wealth", "executive-wealth", "gff",
 "itr-filing-partnerships", "itr-file-retail", "itr-filing-retail", "itr-filing-retail-plans"
]

class Browser:
 def __init__(self):
  self.profile = tempfile.TemporaryDirectory(prefix="fintoo-capture-")
  self.process = subprocess.Popen([
   "google-chrome", "--headless=new", "--disable-gpu", "--disable-dev-shm-usage",
   "--disable-extensions", "--no-first-run", "--hide-scrollbars", "--remote-debugging-port=0",
   "--remote-allow-origins=*", f"--user-data-dir={self.profile.name}",
   "--window-size=1440,900", "about:blank"
  ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
  port_file = Path(self.profile.name) / "DevToolsActivePort"
  deadline = time.time() + 15
  while not port_file.exists() and time.time() < deadline: time.sleep(.1)
  if not port_file.exists(): raise RuntimeError("Chrome did not start")
  port = port_file.read_text().splitlines()[0]
  session = requests.Session(); session.trust_env = False
  target = next(x for x in session.get(f"http://127.0.0.1:{port}/json/list", timeout=5).json() if x["type"] == "page")
  self.ws = websocket.create_connection(target["webSocketDebuggerUrl"], timeout=10,
                                         suppress_origin=True, http_proxy_host=None)
  self.command_id = 0

 def command(self, method, params=None, timeout=15):
  self.command_id += 1; wanted = self.command_id
  self.ws.send(json.dumps({"id": wanted, "method": method, "params": params or {}}))
  deadline = time.time() + timeout
  while time.time() < deadline:
   message = json.loads(self.ws.recv())
   if message.get("id") == wanted:
    if "error" in message: raise RuntimeError(message["error"]["message"])
    return message.get("result", {})
  raise TimeoutError(method)

 def close(self):
  try: self.ws.close()
  finally:
   self.process.terminate()
   try: self.process.wait(timeout=5)
   except subprocess.TimeoutExpired:
    self.process.kill(); self.process.wait(timeout=5)
   # Chrome can briefly keep profile files open after the browser exits. Cleanup
   # must never turn an otherwise valid screenshot into a failed capture.
   for _ in range(5):
    try:
     self.profile.cleanup(); break
    except OSError:
     time.sleep(.2)

def capture(page, output):
 browser = Browser()
 try:
  browser.command("Page.enable")
  browser.command("Emulation.setDeviceMetricsOverride", {"width":1440,"height":900,"deviceScaleFactor":1,"mobile":False})
  browser.command("Page.navigate", {"url":f"https://www.fintoo.in/{page}"})
  deadline = time.time() + 45; text_length = 0
  while time.time() < deadline:
   time.sleep(1)
   result = browser.command("Runtime.evaluate", {"expression":"document.body?.innerText.trim().length || 0","returnByValue":True})
   text_length = result.get("result", {}).get("value", 0)
   if text_length > 100:
    time.sleep(5)  # Let visible images, webfonts, and animations finish after content appears.
    break
  if text_length <= 100: raise RuntimeError("visible page content never appeared")
  shot = browser.command("Page.captureScreenshot", {"format":"png","captureBeyondViewport":False,"fromSurface":True})
  output.write_bytes(base64.b64decode(shot["data"]))
  image = Image.open(output).convert("RGB").resize((180,112))
  if output.stat().st_size < 10000 or sum(ImageStat.Stat(image).stddev) < 12:
   output.unlink(missing_ok=True); raise RuntimeError("blank image rejected")
 finally: browser.close()

def main():
 pages = sys.argv[1:] or PAGES
 if set(pages) - set(PAGES): raise SystemExit("Unknown page name")
 output_dir = Path("assets/financial-page-previews"); output_dir.mkdir(parents=True, exist_ok=True)
 failures = []
 for index, page in enumerate(pages, 1):
  output = output_dir / f"{page}.png"; print(f"[{index}/{len(pages)}] Waiting for {page}", flush=True)
  for attempt in range(1, 4):
   try:
    capture(page, output); print(f"  captured after load ({output.stat().st_size:,} bytes)", flush=True); break
   except Exception as error:
    output.unlink(missing_ok=True); print(f"  attempt {attempt} rejected: {error}", flush=True)
  else: failures.append(page)
 if failures: raise SystemExit("No valid screenshot for: " + ", ".join(failures))
 print(f"Validated {len(pages)} loaded screenshots.")

if __name__ == "__main__": main()

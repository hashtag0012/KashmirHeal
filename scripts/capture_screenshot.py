from playwright.sync_api import sync_playwright
import time, os

def capture():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')
        # give extra time for animations
        time.sleep(2)
        screenshot_path = os.path.abspath('screenshot_mobile.png')
        page.screenshot(path=screenshot_path, full_page=True)
        print(f'Screenshot saved to {screenshot_path}')
        browser.close()

if __name__ == '__main__':
    capture()

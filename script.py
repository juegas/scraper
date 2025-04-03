from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup

url = "https://www.etrailer.com/Vehicle-Suspension/Air-Lift/AL60844.html"

# Set up headless Chrome
options = Options()
options.headless = True
options.add_argument("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
driver = webdriver.Chrome(options=options)

# Fetch the page
driver.get(url)

# Wait for content to load
import time
time.sleep(3)  # Adjust if needed

# Parse the HTML
soup = BeautifulSoup(driver.page_source, "html.parser")
price_element = soup.find("span", class_="price")  # Update after inspecting

if price_element:
    print(f"Price: {price_element.text.strip()}")
else:
    print("Price not found. Check the HTML structure.")

driver.quit()
# Couple Expense Tracker - Complete Usage Guide

## 📱 Desktop, Mobile & Tablet Setup

The Couple Expense Tracker is a **Progressive Web App (PWA)** that works on all devices:
- 💻 Windows/Mac/Linux Desktop
- 📱 Android Phones & Tablets
- 🍎 iPhone/iPad

---

## 🖥️ DESKTOP USAGE

### Method 1: Access via Web Browser (Easiest)

**For any Desktop (Windows, Mac, Linux):**

1. **Open Browser:**
   - Chrome, Firefox, Edge, or Safari
   - Go to: `https://htmlpreview.github.io/?https://github.com/Chiammu/couple-expense-tracker/blob/main/index.html`
   - OR Download files and open `index.html` locally

2. **Using the App:**
   - Add Expense → Fill form and click "Add Expense"
   - View Summary → Click "Summary" tab
   - Settings → Export/Import data
   - Toggle Theme → Switch between Light/Dark mode

3. **Keyboard Shortcuts:**
   - `Tab` - Navigate between form fields
   - `Enter` - Submit form
   - `Ctrl+S` - Browser will save if prompted

### Method 2: Install as Desktop App (Recommended)

**Windows/Mac/Linux - Install PWA:**

1. **Open in Chrome/Edge/Firefox:**
   - Navigate to the app URL

2. **Install App:**
   - **Chrome/Edge:** 
     - Look for install icon (⬇️ with arrow) in address bar
     - Click → Select "Install"
   - **Firefox:** 
     - Menu → Install App option

3. **Launch:**
   - Desktop icon will be created
   - Runs in its own window (like native app)
   - Works offline

4. **Benefits:**
   - Cleaner interface (no browser tabs/address bar)
   - Faster startup
   - Appears in applications menu
   - Can pin to taskbar

### Method 3: Local File Access

**Run Locally (Best for Privacy):**

```bash
# 1. Download all files to your computer
# 2. Open terminal/cmd in the folder

# Python 3:
python -m http.server 8000

# Python 2:
python -m SimpleHTTPServer 8000

# Node.js:
npx http-server

# Ruby:
ruby -run -ehttpd . -p8000

# 3. Open browser and go to:
# http://localhost:8000
```

---

## 📱 ANDROID PHONE & TABLET

### Option 1: PWA Installation (Recommended - No App Store Needed)

**Chrome Browser:**

1. **Open App in Chrome:**
   - Open Chrome
   - Go to: `https://htmlpreview.github.io/?https://github.com/Chiammu/couple-expense-tracker/blob/main/index.html`
   - Wait for page to load completely

2. **Install App:**
   - Look for "Install app" prompt at bottom OR
   - Tap menu (⋮) → "Install app" → "Install"
   - App will be added to home screen

3. **Use App:**
   - Tap app icon to open
   - Works offline after first load
   - Appears in app drawer
   - Can uninstall like any app

**Firefox Browser:**

1. Open in Firefox
2. Tap menu (⋮) → "Install" or "Add to home screen"
3. Select "Firefox PWA"
4. Opens as standalone app

**Samsung Browser:**

1. Open the app URL
2. Menu → "Add page to" → "Home screen"
3. Or tap ⋮ → "Install app"

### Option 2: Bookmark Shortcut (Quick Access)

If PWA installation doesn't work:

1. Open the app in browser
2. Tap ⋮ menu → "Add bookmark"
3. Name it "Expense Tracker"
4. Long-press bookmark → "Add to home screen"

### Option 3: Share Link to Home Screen

1. Open app in browser
2. Tap Share icon
3. "Add to home screen"
4. Creates quick access icon

### Features on Android:

✅ Full offline support after first load
✅ Local data storage (IndexedDB)
✅ Auto-backup every change
✅ Light/Dark theme
✅ Works portrait & landscape
✅ Works on low bandwidth
✅ No internet permission needed
✅ No ads or tracking

### Android Troubleshooting:

| Problem | Solution |
|---------|----------|
| App doesn't appear on home screen | Try Firefox or Chrome; ensure page fully loads |
| Data disappears when closing app | Data is in IndexedDB - check app settings |
| App closes unexpectedly | Restart phone; clear browser cache |
| Offline not working | Must load app online first; then works offline |
| Can't see install prompt | Scroll down on first page load |

---

## 🍎 iPhone & iPad (iOS)

### Option 1: Add to Home Screen (PWA Installation)

**Safari Browser:**

1. **Open in Safari:**
   - Safari app
   - Go to: `https://htmlpreview.github.io/?https://github.com/Chiammu/couple-expense-tracker/blob/main/index.html`

2. **Add to Home Screen:**
   - Tap Share icon (⬆️ from bottom)
   - Scroll down → "Add to Home Screen"
   - Name: "Expense Tracker"
   - Tap "Add"

3. **Use App:**
   - Tap icon on home screen
   - Opens full-screen like native app
   - Works offline
   - No browser interface

**Chrome/Firefox on iOS:**

1. Open app URL in Chrome/Firefox
2. Tap Share → "Add to Home Screen"
3. Same as Safari

### Option 2: App Drawer Shortcut

If home screen installation doesn't work:

1. Safari menu → Bookmarks → Add bookmark
2. Long-press bookmark → "Edit"
3. Select "Add to Home Screen"

### Features on iOS:

✅ Works on iPhone 6S and newer
✅ Full-screen mode (no browser showing)
✅ Local storage with IndexedDB
✅ Auto-syncs between devices (via iCloud if saved)
✅ Responsive design for all screen sizes
✅ Light/Dark mode support
✅ Offline-first architecture

### iOS Troubleshooting:

| Problem | Solution |
|---------|----------|
| Share button not visible | Pull up from bottom of screen |
| Icon not on home screen | Close Safari and try again; ensure 'Save to Home' is tapped |
| App opens in Safari instead | Long-press app icon → "Add to Home Screen" again |
| Data not saved | Check Settings → Safari → Clear History/Website Data (don't clear) |
| Slow loading | Ensure WiFi connected; first load takes longer |

---

## 💾 Data Sync Between Devices

### Backup & Restore Method:

**Desktop to Mobile:**

1. On Desktop: Settings → Export to JSON
2. Save file to cloud (Google Drive, Dropbox, etc.)
3. On Mobile: Settings → Import JSON
4. Select downloaded file
5. Data synced!

**Mobile to Desktop:**

1. On Mobile: Settings → Export to JSON
2. Share file (email, cloud, etc.)
3. Download on Desktop
4. Open in browser → Settings → Import JSON
5. All data restored!

### Real-Time Sync (Manual):

1. Every change auto-backs up locally
2. Export from one device
3. Import on other device
4. All data stays in sync

---

## 🔋 Battery & Performance Tips

### For All Devices:

✅ **Auto-Close Feature:**
- App runs in background
- Auto-saves every change
- Can safely close anytime

✅ **Battery Saving:**
- Light mode uses less battery
- Offline mode uses no data
- App size is only ~100KB

✅ **Performance:**
- Works on 4G/5G
- Works on slow WiFi
- Works completely offline
- No server requests

---

## 🌐 Multi-Device Setup (Couple Scenario)

### For Husband:

1. Install on phone
2. Settings → Export to JSON (weekly)
3. Share with wife via email/cloud

### For Wife:

1. Install on phone
2. Settings → Import JSON (from husband)
3. Add your own expenses
4. Settings → Export to JSON
5. Share back with husband

### Keep Everything Synced:

1. Agree on update frequency (daily/weekly)
2. Person A exports at end of day
3. Person B imports next morning
4. Person B adds their expenses
5. Export and send back to Person A
6. Person A imports latest

---

## 📊 Using on Tablet

### iPad:
- Same as iPhone (use Safari)
- Add to home screen
- Larger screen is great for forms

### Android Tablet:
- Same as Android phone
- Install as app
- Works in landscape orientation
- Perfect for couple sitting together

---

## 🔒 Data Privacy & Security

### All Data Stays Local:

✅ **No Cloud Upload:**
- Data never sent to servers
- All stored locally on device
- Only you can access your data

✅ **Offline by Default:**
- Internet only needed for first load
- After that, completely offline
- No tracking
- No ads

✅ **Safe to Share Device:**
- Data in separate browser storage
- Husband and wife can have separate accounts
- Other people using device won't see data

---

## ⚙️ Important Settings

### Light/Dark Mode:
- Click "Toggle Theme" button
- Saves automatically
- Persists across sessions

### Export Data:
- Settings → Export to JSON
- Backup your data
- Can share between devices
- Save to safe location

### Import Data:
- Settings → Import JSON
- Or → Import CSV (if you have old data)
- Replaces existing data
- Confirm before importing

### Clear All:
- Settings → Clear All Expenses
- CAREFUL: Cannot undo!
- Always backup first

---

## 🆘 Troubleshooting

### App Won't Load:

1. Check internet connection
2. Clear browser cache
3. Try different browser
4. Refresh page (pull down to refresh)

### Data Lost:

1. Check if settings→export has backup
2. Check browser storage (DevTools)
3. Reinstall might recover data
4. Use backup if available

### Can't Add Expense:

1. All fields required
2. Amount must be number
3. Date must be valid
4. Try refreshing page

### Offline Not Working:

1. Must load app online first
2. Service worker takes 10 seconds to load
3. Check app status in DevTools

---

## 📲 Device Recommendations

### Best Experience:

**Desktop:**
- Install PWA for best UI
- Use Firefox or Chrome
- 1920x1080 or higher

**Mobile:**
- Install as PWA (not browser)
- Use Chrome or Safari
- Any recent phone (2018+)

**Tablet:**
- iPad (latest 2-3 years)
- Samsung Galaxy Tab (recent)
- Landscape mode for better view

---

## 🚀 Quick Start Checklist

- [ ] Download or access app
- [ ] Load in browser first time
- [ ] Install as PWA app
- [ ] Add first expense
- [ ] Check Summary
- [ ] Export data as backup
- [ ] Share with spouse
- [ ] Set up sync routine
- [ ] Test offline mode
- [ ] Customize theme

---

## 📞 Support

- Check INTEGRATION_COMPLETE.md for technical details
- Check REFACTORING_SUMMARY.md for architecture
- All data stored locally - no server issues
- Works completely offline

**Enjoy tracking expenses together!** 💳✨

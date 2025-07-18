# User Guide: Data Management Features

## How to Access Data Management

### Step 1: Open Settings
1. **Click on your profile** (top-right corner, "Test User")
2. **Click "Settings"** from the dropdown menu
3. **Click the "Data" tab** in the settings modal

### Step 2: Navigate to Data Management
The Data tab will show you:
- 📊 **Data Statistics** at the top
- 📤 **Export Data** section
- 📥 **Import Data** section  
- 💾 **Create Backup** section
- 🗑️ **Reset Data** section

## How to Use Each Feature

### 📤 Export Your Data

**What it does**: Downloads all your habits, tasks, Pi rewards, and settings as a JSON file.

**How to use**:
1. Click the **"Export Data"** button
2. Your browser will automatically download a file named `salenus-ai-backup-YYYY-MM-DD.json`
3. Save this file somewhere safe on your computer

**What's included in the export**:
- All your habits and their progress
- All your tasks and their status
- All your Pi Network reward entries
- Your user profile and settings
- Export date and version information

### 📥 Import Your Data

**What it does**: Restores your data from a previously exported file.

**How to use**:
1. Click **"Choose File"** in the Import Data section
2. Select your backup JSON file
3. The system will automatically import all your data
4. You'll see a success message with details of what was imported

**Important notes**:
- Only use files that were exported from Salenus A.I
- The import will replace your current data
- Make sure to backup current data before importing

### 💾 Create a Backup

**What it does**: Creates a local backup that you can restore from later.

**How to use**:
1. Click the **"Create Backup"** button
2. The system will create a backup with today's date
3. You'll see a success message confirming the backup was created

**Backup management**:
- The system keeps your last 5 backups automatically
- Older backups are automatically removed
- Backups are stored locally in your browser

### 🗑️ Reset Your Data

**What it does**: Permanently deletes all your habits, tasks, Pi rewards, and backups.

**How to use**:
1. **⚠️ WARNING**: This action cannot be undone!
2. Click the **"Reset Data"** button
3. Confirm the action when prompted
4. All your data will be permanently deleted

**When to use reset**:
- Starting fresh with a clean slate
- Removing all test data
- Troubleshooting data issues

## Data Statistics Explained

### 📊 What the Statistics Mean

**Habits Count**: Number of habits you've created
**Tasks Count**: Number of tasks in your task manager  
**Pi Rewards Count**: Number of Pi Network reward entries
**Backups Count**: Number of local backups stored
**Total Size**: How much storage your data uses (in KB)

### 🔄 Real-time Updates

The statistics update automatically when you:
- Add or remove habits
- Create or complete tasks
- Add Pi Network rewards
- Create or delete backups

## Troubleshooting

### Export Issues
**Problem**: Export button doesn't work
**Solution**: 
- Check if you have data to export
- Try refreshing the page
- Check browser download settings

### Import Issues
**Problem**: Import fails
**Solution**:
- Make sure you're using a valid backup file
- Check that the file is a JSON format
- Try exporting a fresh backup first

### Backup Issues
**Problem**: Can't create backup
**Solution**:
- Check if you have data to backup
- Clear browser cache if needed
- Try refreshing the page

### Reset Issues
**Problem**: Reset doesn't work
**Solution**:
- Make sure you've confirmed the action
- Check if you have data to reset
- Try refreshing the page

## Best Practices

### 🔒 Data Security
- **Keep backups safe**: Store exported files in a secure location
- **Regular backups**: Create backups before major changes
- **Multiple copies**: Keep backups in different locations

### 📱 Cross-Device Usage
- **Export before switching**: Export data before using on a new device
- **Import on new device**: Import your backup on the new device
- **Sync regularly**: Export and import regularly to keep data in sync

### 🧹 Data Maintenance
- **Regular cleanup**: Reset data periodically to start fresh
- **Monitor storage**: Keep an eye on data size
- **Archive old data**: Export and delete old data you don't need

## Advanced Features

### 🔄 Data Migration
If you need to move data between different accounts:
1. Export data from the old account
2. Import data to the new account
3. Verify all data transferred correctly

### 📊 Data Analysis
You can analyze your exported JSON files to:
- Track habit completion rates
- Analyze task productivity
- Monitor Pi Network earnings
- Review usage patterns

### 🔧 Custom Data Management
For advanced users:
- Edit JSON files manually (be careful!)
- Create custom backup schedules
- Implement automated backup systems

## Quick Reference

### Keyboard Shortcuts
- **Settings**: `Ctrl + ,` (opens settings)
- **Export**: Use the Export Data button
- **Import**: Use the file upload button
- **Backup**: Use the Create Backup button
- **Reset**: Use the Reset Data button (with confirmation)

### Status Messages
- **Green messages**: Success operations
- **Red messages**: Error operations
- **Loading indicators**: Operations in progress

### File Locations
- **Exported files**: Browser's default download folder
- **Backup files**: Stored in browser's localStorage
- **Import files**: Select from any folder on your computer

## Need Help?

If you encounter any issues with data management:

1. **Check the status messages** in the Data tab
2. **Try refreshing the page** and try again
3. **Export your data** before making changes
4. **Contact support** if problems persist

Remember: Your data is stored locally in your browser, so it's important to export backups regularly! 
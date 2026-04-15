import Settings from '../models/Settings.js';

// Get user settings
export const getSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    let settings = await Settings.findOne({ where: { userId } });
    
    // If settings don't exist, create default settings
    if (!settings) {
      settings = await Settings.create({ userId });
    }
    
    res.json(settings);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user settings
export const updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notifications, theme, language } = req.body;
    
    let settings = await Settings.findOne({ where: { userId } });
    
    // If settings don't exist, create them
    if (!settings) {
      settings = await Settings.create({ userId });
    }
    
    // Update settings
    if (notifications !== undefined) settings.notifications = notifications;
    if (theme) settings.theme = theme;
    if (language) settings.language = language;
    
    await settings.save();
    
    res.json(settings);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
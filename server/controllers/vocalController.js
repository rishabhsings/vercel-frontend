import { db } from '../utils/dbHelper.js';

export const updateVocalProfile = async (req, res) => {
  const { voiceType, minFrequency, maxFrequency, lowestNote, highestNote } = req.body;

  try {
    const updatedUser = await db.updateUser(req.userId, {
      vocalProfile: {
        voiceType,
        minFrequency,
        maxFrequency,
        lowestNote,
        highestNote
      }
    });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Vocal profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update Vocal Profile Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

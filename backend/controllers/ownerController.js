const { addOrUpdate, get } = require("../services/firebaseService");

const updateOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerInfo = req.body;
  
    if (!req.user) {
      return res.status(400).json({ status: 'error', message: 'You must login first' });
    }
  
    const owner = await get("users", id);
    if (!owner) {
      return res.status(400).json({ status: 'error', message: 'Your account does not exist' });
    }
  
    await addOrUpdate("users", { ...owner, ...ownerInfo, updatedAt: new Date().toISOString() }, id);
    const updatedOwner = await get("users", id);
    res.status(200).json({ status: 'ok', message: 'Update your information successfully', data: updatedOwner });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Something went wrong', details: error });
  }
}

const getOwnerById = async (req, res) => {
  try {
    const { id } = req.params;
    const owner = await get("users", id);
    if (!owner) {
      return res.status(400).json({ status: 'error', message: 'Your account does not exist' });
    }
    res.status(200).json({ status: 'ok', message: 'Get your information successfully', data: owner });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Something went wrong', details: error });
  }
}

module.exports = { updateOwner, getOwnerById };
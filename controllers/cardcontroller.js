const { BusinessCard } = require('../models/models');
const { generateQRCode } = require('../qrCodeGenerator');

const createBusinessCard = async (req, res) => {
  try {
    const { name, phone, email, location, expertise, isPublic, bio, socialLinks } = req.body;
    const userId = req.user._id;

    const businessCard = new BusinessCard({
      name,
      phone,
      location,
      expertise,
      isPublic,
      userId,
      bio,
      socialLinks
    });

    await businessCard.save();

    const qrCodeDataURL = await generateQRCode(businessCard);
    businessCard.qrCodeDataURL = qrCodeDataURL;
    await businessCard.save();

    res.status(201).json(businessCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating business card' });
  }
};

const getBusinessCard = async (req, res) => {
  try {
    const businessCard = await BusinessCard.findById(req.params.id).populate('expertise');

    if (!businessCard) {
      return res.status(404).json({ message: 'Business card not found' });
    }

    // Check if the business card is public or belongs to the authenticated user
    if (businessCard.isPublic || (req.user && req.user._id.equals(businessCard.user))) {
      res.json(businessCard);
    } else {
      res.status(403).json({ message: 'You do not have permission to view this business card' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const updateBusinessCard = async (req, res) => {
  try {
    const businessCardId = req.params.id;
    const updates = req.body;
    const userId = req.user._id;

    const businessCard = await BusinessCard.findOne({ _id: businessCardId, userId });

    if (!businessCard) {
      return res.status(404).json({ message: 'Business card not found' });
    }

    const keysToUpdate = ['name', 'phone', 'location', 'expertise', 'isPublic', 'bio', 'socialLinks'];
    keysToUpdate.forEach((key) => {
      if (updates.hasOwnProperty(key)) {
        businessCard[key] = updates[key];
      }
    });

    await businessCard.save();

    res.json(businessCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating business card' });
  }
};


const deleteBusinessCard = async (req, res) => {
  try {
    const businessCardId = req.params.id;
    const userId = req.user._id;

    const businessCard = await BusinessCard.findOne({ _id: businessCardId, userId });

    if (!businessCard) {
      return res.status(404).json({ message: 'Business card not found' });
    }

    await businessCard.remove();

    res.json({ message: 'Business card deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting business card' });
  }
};

const searchPublicBusinessCards = async (req, res) => {
  const { searchTerm, location, expertise } = req.query;
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;

  const searchQuery = { isPublic: true };

  if (searchTerm) {
    searchQuery.$text = { $search: searchTerm };
  }

  if (location) {
    searchQuery.location = { $regex: new RegExp(location, 'i') };
  }

  try {
    const count = await BusinessCard.countDocuments(searchQuery);
    let businessCards = await BusinessCard.find(searchQuery)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('expertise');

    // If filtering by expertise is required, perform the filtering in-memory
    if (expertise) {
      const expertiseRegex = new RegExp(expertise, 'i');
      businessCards = businessCards.filter(card => {
        return card.expertise.some(exp => expertiseRegex.test(exp.name));
      });
    }

    res.json({ businessCards, page, totalPages: Math.ceil(count / pageSize) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error searching for public business cards' });
  }
};

module.exports = {
    createBusinessCard,
    getBusinessCard,
    updateBusinessCard,
    deleteBusinessCard,
    searchPublicBusinessCards,
};

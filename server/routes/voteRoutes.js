const express = require('express');
const router = express.Router();
const { protectRoute, adminOnly } = require('../middleware/authMiddleware');
const Election = require('../models/Election');
const Vote = require('../models/Vote');

// 📍 GET /api/vote/elections - List all elections (voter access)
router.get('/elections', protectRoute, async (req, res) => {
  try {
    const elections = await Election.find();
    res.json(elections);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch elections' });
  }
});

// 📍 POST /api/vote/cast - Cast a vote (voter access)
router.post('/cast', protectRoute, async (req, res) => {
  const { electionId, candidateName } = req.body;
  const userId = req.user.id;

  try {
    const alreadyVoted = await Vote.findOne({ userId, electionId });
    if (alreadyVoted) {
      return res.status(400).json({ message: 'You have already voted in this election' });
    }

    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    const candidate = election.candidates.find(c => c.name === candidateName);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    candidate.votes += 1;
    await election.save();

    const vote = new Vote({ userId, electionId });
    await vote.save();

    res.json({ message: 'Vote cast successfully' });

  } catch (err) {
    console.error('❌ Vote error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 📍 POST /api/vote/create-election - Admin creates election
router.post('/create-election', protectRoute, adminOnly, async (req, res) => {
  const { title, candidates } = req.body;

  if (!title || !Array.isArray(candidates) || candidates.length === 0) {
    return res.status(400).json({ message: 'Title and candidates are required' });
  }

  const formattedCandidates = candidates.map(name => ({ name }));

  try {
    const election = new Election({ title, candidates: formattedCandidates });
    await election.save();
    res.json({ message: 'Election created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create election' });
  }
});

// 📍 GET /api/vote/results - Admin views results
router.get('/results', protectRoute, adminOnly, async (req, res) => {
  console.log("🛡️ User attempting to access results:", req.user);
  try {
    const elections = await Election.find();
    res.json(elections);
  } catch (err) {
    console.error('❌ Fetch results error:', err);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});
// 📍 DELETE /api/vote/delete-election/:id - Admin deletes an election
router.delete('/delete-election/:id', protectRoute, adminOnly, async (req, res) => {
  try {
    const electionId = req.params.id;
    await Election.findByIdAndDelete(electionId);
    res.json({ message: 'Election deleted successfully' });
  } catch (err) {
    console.error('❌ Delete election error:', err);
    res.status(500).json({ error: 'Failed to delete election' });
  }
});


module.exports = router;

const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private

router.post(
  "/",[ auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // Build profile object
    const profileFields = {};  // Initialize profileFields object to store the profile data in the database
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    // Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update if profile exists
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields }, 
          { new: true }
        );

        return res.json(profile);
      }

      // Create if profile does not exist
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public

router.get("/", async (req, res) => {
    try {
        const profiles = await Profile.find().populate("user", ["name", "avatar"]); // Get all profiles and populate the user field with the name and avatar
        res.json(profiles); // Return the profiles
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
    });

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get("/user/:user_id", async (req, res) => {
    try {
        const profile = await
        Profile.findOne({ user: req.params.user_id }).populate("user", ["name", "avatar"]); // Find the profile by user ID and populate the user field with the name and avatar
        if (!profile) return res.status(400).json({ msg: "Profile not found" }); // If the profile does not exist, return an error message
        res.json(profile); // Return the profile
    } catch (err) {
        console.error(err.message);
        if (err.kind == "ObjectId") {
            return res.status(400).json({ msg: "Profile not found" });
        }
        res.status(500).send("Server Error");
    }
    }
);

// @route   DELETE api/profile
// @desc    Delete profile, user & posts
// @access  Private

router.delete("/", auth, async (req, res) => {
    try {
        // @todo - remove user's posts
        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        // Remove user  
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ msg: "User deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
    }
);

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private

router.put(
    "/experience",
    [
        auth,
        [
            check("title", "Title is required").not().isEmpty(),
            check("company", "Company is required").not().isEmpty(),
            check("from", "From date is required").not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        } = req.body;
        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description,
        };
        try {
            const profile = await Profile.findOne({ user: req.user.id });
            profile.experience.unshift(newExp);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private

router.delete("/experience/:exp_id", auth, async (req, res) => {
    try {
        const profile = await
        Profile.findOne({ user: req.user.id }); // Find the profile by user ID
        // Get the index of the experience to remove
        const removeIndex = profile.experience.map((item) => item.id).indexOf(req.params.exp_id);  // Get the index of the experience to remove
        profile.experience.splice(removeIndex, 1); // Remove the experience
        await profile.save(); // Save the profile
        res.json(profile); // Return the profile
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
    }
);

// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private

router.put(
    "/education",
    [
        auth,
        [
            check("school", "School is required").not().isEmpty(),
            check("degree", "Degree is required").not().isEmpty(),
            check("fieldofstudy", "Field of study is required").not().isEmpty(),
            check("from", "From date is required").not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req); // Check for errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        } = req.body;
        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description,
        };
        try {
            const profile = await Profile.findOne({ user: req.user.id }); // Find the profile by user ID
            profile.education.unshift(newEdu); // Add the education
            await profile.save(); // Save the profile
            res.json(profile); // Return the profile
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private

router.delete("/education/:edu_id", auth, async (req, res) => {
    try {
        const profile = await
        Profile.findOne({ user: req.user.id }); // Find the profile by user ID
        // Get the index of the education to remove
        const removeIndex = profile.education.map((item) => item.id).indexOf(req.params.edu_id); // Get the index of the education to remove
        profile.education.splice(removeIndex, 1); // Remove the education
        await profile.save(); // Save the profile
        res.json(profile); // Return the profile
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
    }
);


module.exports = router;

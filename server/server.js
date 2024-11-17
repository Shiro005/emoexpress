const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const crypto = require("crypto");

// Configure ElephantSQL
const pool = new Pool({
    connectionString: "postgres://hfgirdqa:v46OeV2qm03Mb2RG_xm5gwMbMRsHkpmC@kandula.db.elephantsql.com/hfgirdqa",
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Mock data for random names and profile pictures
const randomProfiles = [
  { name: "SkibidiVibes", pic: "https://th.bing.com/th/id/OIP.IqFzACXwpkem7GGiFwCCRAHaEK?w=321&h=180&c=7&r=0&o=5&dpr=1.4&pid=1.7" },
  { name: "RizzlerKing", pic: "https://th.bing.com/th/id/OIP.rqpfAQk1iqv0uO1ncVnrNgHaHa?w=198&h=198&c=7&r=0&o=5&dpr=1.4&pid=1.7" },
  { name: "GyaatMaster", pic: "https://th.bing.com/th/id/OIP.Fw6GZScnBeTMuexbjs3m9wHaJ4?w=136&h=181&c=7&r=0&o=5&dpr=1.4&pid=1.7" },
  { name: "HypeBeast", pic: "https://th.bing.com/th/id/OIP.5F22ZQp_svPfP4wAq5GhTgHaGL?w=178&h=180&c=7&r=0&o=5&dpr=1.4&pid=1.7" },
  { name: "VibeCheck", pic: "https://th.bing.com/th/id/OIP.6VFjw0xIOqYAwwzIUOQ8ngHaEs?w=273&h=180&c=7&r=0&o=5&dpr=1.4&pid=1.7" },
  { name: "FlexKing", pic: "https://th.bing.com/th/id/OIP.HdShZaJ7awJQZIBT22QKlAHaE8?w=270&h=180&c=7&r=0&o=5&dpr=1.4&pid=1.7" },
  { name: "ChillMode", pic: "https://th.bing.com/th/id/OIP.KkHfuU0j6A9-dYusQQh2GAHaIN?w=145&h=180&c=7&r=0&o=5&dpr=1.4&pid=1.7" },
  { name: "MoodSwinger", pic: "https://i.pinimg.com/736x/3d/81/ac/3d81ac4154162588478c75e236f2e356.jpg" },
  { name: "SaucyBoi", pic: "https://th.bing.com/th/id/OIP.r2E7B0V0JJoxicTn2leOjwHaFj?w=202&h=180&c=7&r=0&o=5&dpr=1.4&pid=1.7" },
  { name: "RogueWave", pic: "https://th.bing.com/th/id/OIP.nhSA1io0p00R63sT-cGaiwHaEo?w=251&h=180&c=7&r=0&o=5&dpr=1.4&pid=1.7" }
];


let posts = [
    { id: 1, content: 'Post 1', likes: 0, dislikes: 0, comments: [] },
    { id: 2, content: 'Post 2', likes: 0, dislikes: 0, comments: [] },
  ];
  

// Create a new post
app.post("/posts", async (req, res) => {
    const { content } = req.body;

    // Assign a random profile to the user
    const randomIndex = Math.floor(Math.random() * randomProfiles.length);
    const randomUser = randomProfiles[randomIndex];

    try {
        let user = await pool.query("SELECT * FROM users WHERE random_name = $1", [randomUser.name]);

        if (user.rows.length === 0) {
            const newUser = await pool.query(
                "INSERT INTO users (random_name, profile_pic_url) VALUES ($1, $2) RETURNING *",
                [randomUser.name, randomUser.pic]
            );
            user = newUser;
        }

        const post = await pool.query(
            "INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *",
            [user.rows[0].id, content]
        );

        res.status(201).json(post.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Get all posts
app.get("/posts", async (req, res) => {
    try {
        const posts = await pool.query(`
            SELECT posts.id, posts.content, posts.created_at, users.random_name, users.profile_pic_url, 
            COALESCE(SUM(CASE WHEN likes.like_status THEN 1 ELSE 0 END), 0) AS likes_count,
            COALESCE(SUM(CASE WHEN likes.like_status = FALSE THEN 1 ELSE 0 END), 0) AS dislikes_count
            FROM posts
            LEFT JOIN users ON posts.user_id = users.id
            LEFT JOIN likes ON posts.id = likes.post_id
            GROUP BY posts.id, users.random_name, users.profile_pic_url
            ORDER BY posts.created_at DESC
        `);
        res.status(200).json(posts.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Comment on a post
app.post("/comments", async (req, res) => {
    const { post_id, content } = req.body;
    try {
        const comment = await pool.query(
            "INSERT INTO comments (post_id, content) VALUES ($1, $2) RETURNING *",
            [post_id, content]
        );
        res.status(201).json(comment.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Like/Dislike a post
app.post("/likes", async (req, res) => {
    const { post_id, like_status } = req.body;

    try {
        // Check if a like or dislike already exists for this post
        const existingLike = await pool.query(
            "SELECT * FROM likes WHERE post_id = $1",
            [post_id]
        );

        if (existingLike.rows.length > 0) {
            // Update existing like/dislike status
            const updatedLike = await pool.query(
                "UPDATE likes SET like_status = $1 WHERE post_id = $2 RETURNING *",
                [like_status, post_id]
            );
            return res.status(200).json(updatedLike.rows[0]);
        } else {
            // Insert new like/dislike entry
            const newLike = await pool.query(
                "INSERT INTO likes (post_id, like_status) VALUES ($1, $2) RETURNING *",
                [post_id, like_status]
            );
            res.status(201).json(newLike.rows[0]);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/track-view", async (req, res) => {
  const { userAgent, timestamp } = req.body;

  // Generate a unique ID for each device based on userAgent (useful for unique visitor tracking)
  const deviceId = crypto.createHash("sha256").update(userAgent).digest("hex");

  try {
    // Track unique visitors: Only insert if the deviceId does not already exist
    const visitorCheck = await pool.query("SELECT * FROM visitors WHERE device_id = $1", [deviceId]);

    if (visitorCheck.rows.length === 0) {
      // Insert new unique visitor if not already in the database
      await pool.query(
        "INSERT INTO visitors (device_id, timestamp) VALUES ($1, $2)",
        [deviceId, timestamp]
      );
    }

    // Track page view (for total views)
    await pool.query("INSERT INTO page_views (timestamp) VALUES ($1)", [timestamp]);

    res.status(200).send({ message: "View tracked successfully!" });
  } catch (err) {
    console.error("Error tracking view:", err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Endpoint to get total and unique views
app.get("/api/views", async (req, res) => {
  try {
    // Count total views
    const totalViewsResult = await pool.query("SELECT COUNT(*) FROM page_views");
    const totalViews = totalViewsResult.rows[0].count;

    // Count unique visitors (distinct device_ids)
    const uniqueViewsResult = await pool.query("SELECT COUNT(DISTINCT device_id) FROM visitors");
    const uniqueViews = uniqueViewsResult.rows[0].count;

    res.status(200).json({
      totalViews: totalViews,
      uniqueViews: uniqueViews,
    });
  } catch (err) {
    console.error("Error fetching view data:", err);
    res.status(500).send({ message: "Internal Server Error" });
  }
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

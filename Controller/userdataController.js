const pool = require('../db/db');
const QRCode = require('qrcode');

exports.addUser = async (req, res) => {
  const { user_name, review, location, whatsapp, instagram, facebook,url, youtube, contact } = req.body;

  const brochureFile = req.files?.brochure?.[0];
  const logoFile = req.files?.logo?.[0];
  const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];

// Validate file types  
  const isValidFile = (file) => file && allowedMimeTypes.includes(file.mimetype);

  if ((brochureFile && !isValidFile(brochureFile)) || (logoFile && !isValidFile(logoFile))) {
    return res.status(400).json({
      statusCode: 400,
      message: 'Invalid file type. Only PNG, JPG, JPEG, and PDF files are allowed.',
    });
  }

  const currentDate = new Date();
  const expiryDate = new Date();
  expiryDate.setFullYear(currentDate.getFullYear() + 1);

  try {
     
    let genrateurl='';  
    const result = await pool.query(
      `INSERT INTO users (
        user_name, review, location, whatsapp,
        instagram, facebook, url, brochure,
        youtube, logo, contact, date, expiry_date,genrateurl
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,$14)
      RETURNING *`,
      [
        user_name,
        review,
        location,
        whatsapp,
        instagram,
        facebook,
        url,
        brochureFile ? `uploads/${brochureFile.filename}` : null,
        youtube,
        logoFile ? `uploads/${logoFile.filename}` : null,
        contact,
        currentDate,
        expiryDate,
        genrateurl
      ]
    );

    const newUser = result.rows[0];
    const userId = newUser.user_id;
    const userName = newUser.user_name;

    const qrData = `https://linkstand.in/${userName}/${userId}`;
    const qrCodePath = `uploads/qrcode_${userId}.png`;

    await QRCode.toFile(qrCodePath, qrData, { width: 300 });

    await pool.query(
      `UPDATE users SET qr_code = $1, qr_scanner_image = $2 ,genrateurl=$3 WHERE user_id = $4`,
      [
        qrCodePath,
        logoFile ? `uploads/${logoFile.filename}` : null,
        genrateurl,
         userId
      ]
    );

    res.status(200).json({
      statusCode:200,
      message: 'User added with QR Code and dates',
       user: { ...newUser, qr_code: qrCodePath,genrateurl:qrData,  date: currentDate, expiry_date: expiryDate }
    });
  } catch (error) { 
    console.error(error);
    res.status(500).send('Error adding user');
  }
};


exports.getAllUser = async (req, res) => {
  try {
    const alluser = await pool.query("SELECT * FROM users");
    res.status(200).json({
      statusCode: 200,
      message: 'Users Fetched Sucessfully',
      ads: alluser.rows,
    })
  } catch (err) {
    res.status(500).json({ message: 'Internal Server error' })
  }
}


exports.getUserbyId = async (req, res) => {
  try {
    const { user_id } = req.body

    const userid = await pool.query("SELECT * FROM users WHERE user_id=$1",
      [user_id]
    );
    if (userid.rows.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: 'user not found'

      })
    }
    res.status(200).json({
      statusCode: 200,
      message: 'User Fetched Sucessfully',
      user: userid.rows
    })
  } catch (error) {
    res.status(500).json({ message: 'internal Server error' })
  }
}


 // Controller
exports.getUserProfile = async (req, res) => {
  const { user_name, user_id } = req.body;

  try {
    const userResult = await pool.query(
      `SELECT * FROM users WHERE user_id = $1 AND user_name = $2`,
      [user_id, user_name]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const carouselResult = await pool.query(
      `SELECT * FROM tbl_carousel WHERE user_id = $1`,
      [user_id]
    );

    res.status(200).json({
      user: userResult.rows[0],
      carousel: carouselResult.rows
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.deleteUser = async (req, res) => {
  try {
      const { user_id } = req.body;

      if (!user_id) {
          return res.status(400).json({
              statusCode: 400,
              message: 'user id is required',
          });
      }


      const checkUser = await pool.query(
          'SELECT * FROM users WHERE user_id = $1',
          [user_id]
      );

      if (checkUser.rows.length === 0) {
          return res.status(404).json({
              statusCode: 404,
              message: 'User not found',
          });
      }


      const deleteuser = await pool.query(
          'DELETE FROM users WHERE user_id = $1 RETURNING *',
          [user_id]
      );

      res.status(200).json({
          statusCode: 200,
          message: 'User deleted successfully',
          deleteduser: deleteuser.rows[0],
      });

  } catch (error) {

      res.status(500).json({
          statusCode: 500,
          message: 'Internal Server Error',
      });
  }
};
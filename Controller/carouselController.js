const pool = require('../db/db');

exports.addCrousel = async (req, res) => {
    try {

        const {user_id} =req.body
        const carouselimage = req.files?.carousel_image?.[0]?.filename
            ? `uploads/${req.files.carousel_image[0].filename}`
            : null
        const carousel = await pool.query(`INSERT INTO public.tbl_carousel(carousel_image,user_id) values($1,$2) RETURNING *`,
            [carouselimage,user_id]);
          

        res.status(200).json({
            statusCode: 200,
            message: 'Carousel  Added sucessfully',
            carousel: carousel.rows[0]
        })

    } catch (error) {
        console.error('Error in addCrousel:', error);
        res.status(500).json({
            statusCode: 'Internal Server error'
        })
    }
}


exports.getallCarousels = async (req, res) => {
    try {
      const allcarousels = await pool.query(`
        SELECT 
          u.user_name,
          c.carousel_image
        FROM tbl_carousel c
        JOIN users u ON c.user_id = u.user_id
      `);
  
      res.status(200).json({
        statusCode: 200,
        message: 'Carousel fetched successfully',
        carousels: allcarousels.rows,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

exports.getcarouselByuser = async (req, res) => {
    try {
        const { user_id } = req.body;

        const userid = await pool.query(
            "SELECT * FROM tbl_carousel WHERE user_id=$1",
            [user_id]
        );
    
        if (userid.rows.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: "user not found"
            })
        }
        res.status(200).json({
            statusCode: 200,
            message: 'Carousel fectched sucessfully',
            carousel: userid.rows
        })
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: 'internal Server error'
        })
    }
}


exports.updatecarousel = async (req, res) => {
  try {
    const { carousel_id, user_id } = req.body;

    if (!carousel_id) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Carousel ID is required for updating',
      });
    }

    const fields = [];
    const values = [];
    let index = 1;

    const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];
    const file = req.files?.carousel_image?.[0];

    if (file && !allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Invalid file type. Only PNG, JPG, JPEG, and PDF files are allowed.',
      });
    }

    if (file?.filename) {
      const imagePath = `uploads/${file.filename}`;
      fields.push(`"carousel_image" = $${index++}`);
      values.push(imagePath);
    }

    if (user_id) {
      fields.push(`"user_id" = $${index++}`);
      values.push(user_id);
    }

    if (fields.length === 0) {
      return res.status(400).json({
        statusCode: 400,
        message: 'No fields provided to update',
      });
    }

    values.push(carousel_id); // For WHERE clause

    const query = `
      UPDATE public.tbl_carousel
      SET ${fields.join(', ')}
      WHERE "carousel_id" = $${index}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Carousel not found',
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: 'Carousel updated successfully',
      carousel: result.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal Server Error',
    });
  }
};

exports.deleteCarousel = async (req, res) => {
    try {
        const { carousel_id } = req.body;

        if (!carousel_id) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Carousel ID is required',
            });
        }


        const checkCarousel = await pool.query(
            'SELECT * FROM tbl_carousel WHERE carousel_id = $1',
            [carousel_id]
        );

        if (checkCarousel.rows.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Carousel not found',
            });
        }


        const deletecarousel = await pool.query(
            'DELETE FROM tbl_carousel WHERE carousel_id = $1 RETURNING *',
            [carousel_id]
        );

        res.status(200).json({
            statusCode: 200,
            message: 'Carousel deleted successfully',
            deletedCarousel: deletecarousel.rows[0],
        });

    } catch (error) {

        res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
        });
    }
};

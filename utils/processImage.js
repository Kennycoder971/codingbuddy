const path = require("path");
const ErrorResponse = require("../utils/errorResponse");

/**
 * @date 2022-07-20
 * @desc Verify the uploaded image
 * @desc Moves it to the destination
 * @desc Returns the image object
 * @param {object} req
 * @param {object} next
 * @param {object} user
 * @param {string} imageName
 * @returns {object}
 */

const processImage = (req, next, user, imageName) => {
  if (!req.files)
    return next(new ErrorResponse(`Veuillez envoyer une image.`, 400));

  const file = req.files[imageName];

  // Make sure the image is an image
  if (!file.mimetype.startsWith("image"))
    return next(new ErrorResponse(`Veuillez envoyer une image.`, 400));

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD)
    return next(
      new ErrorResponse(`Veuillez envoyer une image de 1Mo ou moins`, 400)
    );

  // Create custom filename
  file.name = `${imageName}_${user.id}${path.parse(file.name).ext}`;

  // Move file to ./public/uploads
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      return next(
        new ErrorResponse(
          `Une erreur est survenue durant le transfert d'image`,
          500
        )
      );
    }
  });

  return file;
};

module.exports = processImage;

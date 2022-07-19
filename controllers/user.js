const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const path = require("path");
/**
 * @date      2022-06-22
 * @desc      Create user
 * @route     POST /api/v1/users
 * @access    Public
 */
exports.createUser = asyncHandler(async (req, res, next) => {
  let user;
  const { username, email } = req.body;

  // Check if username aleady exists
  user = await User.findOne({ username }, user);

  if (user) {
    return next(
      new ErrorResponse("Ce nom d'utilisateur est déjà existant"),
      400
    );
  }

  user = await User.findOne({ email });

  if (user) {
    return next(new ErrorResponse("Cet adresse mail est déjà existante"), 400);
  }

  user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

/**
 * @date      2022-06-22
 * @desc      Get users
 * @route     GET /api/v1/users
 * @access    Public
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(201).json(res.advancedResults);
});

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse("Cet utilisateur n'existe pas"), 404);
  }

  res.status(201).json({
    success: true,
    data: user,
  });
});

/**
 * @date      2022-06-22
 * @desc      Update user
 * @route     PUT /api/v1/users/:id
 * @access    Private
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse("Cet utilisateur n'existe pas"), 404);
  }

  if (req.user.id !== req.params.id) {
    return next(
      new ErrorResponse("Vous n'êtes pas autorisé à modifier cet utilisateur"),
      403
    );
  }

  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    success: true,
    data: user,
  });
});

/**
 * @date      2022-06-22
 * @desc      Register user
 * @route     DELETE /api/v1/users/:id
 * @access    Private
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse("Cet utilisateur n'existe pas"), 404);
  }

  if (req.user.id !== req.params.id) {
    return next(
      new ErrorResponse("Vous n'êtes pas autorisé à supprimer cet utilisateur"),
      403
    );
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * @date      2022-06-22
 * @desc      Update user photo
 * @route     PUT /api/v1/users/:id/photo
 * @access    Private
 */
exports.userPhotoUpload = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(
        `Utilisateur avec l'id ${req.params.id} introuvable`,
        404
      )
    );
  }

  // Make sure that this is the user
  if (user.id.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `Vous n'êtes pas authorisés à modifier cet utilisateur`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Veuillez envoyer une image`, 400));
  }

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(`Veuillez ajouter une image de moins de  1mo`, 400)
    );
  }

  // Create custom filename
  file.name = `photo_${user._id}${path.parse(file.name).ext}`;

  console.log(file.name);
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(
        new ErrorResponse(
          `Une erreur est survenue durant le transfert d'image`,
          500
        )
      );
    }

    await User.findByIdAndUpdate(req.params.id, { profilePicture: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

/**
 * @desc      Upload cover for user
 * @route     PUT /api/v1/users/:id/cover
 * @access    Private
 */
exports.userCoverUpload = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return next(
      new ErrorResponse(
        `L'utilisateur avec l'id ${req.params.id} n'existe pas`,
        404
      )
    );

  if (user.id !== req.user.id)
    return next(
      new ErrorResponse(
        `Vous n'êtes pas authorisé à modifier la photo cet utilisateur`,
        401
      )
    );

  if (!req.files)
    return next(new ErrorResponse(`Veuillez envoyer une image.`, 400));

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith("image"))
    return next(new ErrorResponse(`Veuillez envoyer une image.`, 400));

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD)
    return next(
      new ErrorResponse(`Veuillez envoyer une image de 1Mo ou moins`, 400)
    );

  // Create custom filename
  file.name = `cover_${user.id}${path.parse(file.name).ext}`;

  // Move file to ./public/uploads
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err)
      return next(
        new ErrorResponse(
          `Une erreur est survenue durant le transfert d'image`,
          500
        )
      );

    await User.findByIdAndUpdate(req.params.id, {
      backgroundPicture: file.name,
    });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});

/**
 * @date      2022-06-22
 * @desc      Save a post for a user
 * @route     PUT /api/v1/users/:id/save
 * @access    Private
 */
exports.save = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse("Cet utilisateur n'existe pas"), 404);
  }

  if (req.user.id !== req.params.id) {
    return next(
      new ErrorResponse("Vous n'êtes pas autorisé à modifier cet utilisateur"),
      403
    );
  }

  // Check if the post as alerady been saved
  const isPostExists = user.saves.find((postId) => {
    // Expect a postId in body
    return postId.toString() === req.body.postId.toString();
  });

  if (!isPostExists) {
    user.saves.push(req.body.postId);
    await user.save();
  }

  res.status(201).json({
    success: true,
    data: user.saves,
  });
});

/**
 * @date      2022-06-22
 * @desc      Remove a post in saves array for a user
 * @route     DELETE /api/v1/users/:id/save
 * @access    Private
 */
exports.unsave = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse("Cet utilisateur n'existe pas"), 404);
  }

  if (req.user.id !== req.params.id) {
    return next(
      new ErrorResponse("Vous n'êtes pas autorisé à modifier cet utilisateur"),
      403
    );
  }

  // Expect a postId in body
  await user.update({ $pull: { saves: req.body.postId } });

  res.status(201).json({
    success: true,
    data: {},
  });
});

/**
 * @date      2022-06-22
 * @desc      Add to a user to follow in the following array
 * @route     PUT /api/v1/users/:id/follow
 * @access    Private
 */
exports.addFollow = asyncHandler(async (req, res, next) => {
  const connectedUser = req.user;
  const userToFollowId = req.body.userId;

  let user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse("Cet utilisateur n'existe pas"), 404);
  }

  if (connectedUser.id !== req.params.id) {
    return next(
      new ErrorResponse("Vous n'êtes pas autorisé à modifier cet utilisateur"),
      403
    );
  }

  if (connectedUser.id === userToFollowId) {
    return next(
      new ErrorResponse("Vous ne pouvez pas vous suivre vous même"),
      400
    );
  }

  // Check if the user as already been followed
  const isFollowExists = user.following.find((userId) => {
    return userId?.toString() === userToFollowId.toString();
  });

  if (!isFollowExists) {
    user.following.push(userToFollowId);
    await user.save();

    // Check if the user to follow already has the connected user in is followers
    const userToFollow = await User.findById(userToFollowId);

    const isFollowerExists = userToFollow.followers.find((userId) => {
      return userId?.toString() === connectedUser.id.toString();
    });

    if (!isFollowerExists) {
      // Add a follower to the user to follow array
      await User.findByIdAndUpdate(userToFollowId, {
        $push: { followers: connectedUser.id },
      });
    }
  }

  res.status(201).json({
    success: true,
    data: user.following,
  });
});

/**
 * @date      2022-06-22
 * @desc      Remove to a user to follow in the following array
 * @route     DELETE /api/v1/users/:id/follow
 * @access    Private
 */
exports.removeFollow = asyncHandler(async (req, res, next) => {
  const connectedUser = req.user;
  const userToRemoveId = req.body.userId;

  let user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse("Cet utilisateur n'existe pas"), 404);
  }

  if (connectedUser.id !== req.params.id) {
    return next(
      new ErrorResponse("Vous n'êtes pas autorisé à modifier cet utilisateur"),
      403
    );
  }

  // Remove a user in the following array of the connected user
  user = await User.findByIdAndUpdate(
    connectedUser.id,
    {
      $pull: { following: userToRemoveId },
    },
    { new: true }
  );

  // Add a follower to the user to follow array
  await User.findByIdAndUpdate(userToRemoveId, {
    $pull: { followers: connectedUser.id },
  });

  res.status(201).json({
    success: true,
    data: user.following,
  });
});

const { comment, log, user} = require('../models/db')

// Ambil semua komentar
const getAllComments = async (req, res) => {
  try {
    const comments = await comment.findAll({
      include: [
        {
          model: user,
          attributes:['username']
        }
      ],
      order:[['created_at', 'DESC']]
    });

    const result = comments.map(c => ({
      id: c.id,
      user_id: c.user_id,
      username: c.user?.username || 'unknown',
      comment: c.comment,
      image: c.image,
      created_at: c.created_at
    }));

    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error getAllCOmment', err);    
    res.status(500).json({ success: false, message: 'Gagal mengambil komentar' });
  }
};


// Hapus komentar
const deleteComment = async (req, res) => {
  const { id } = req.params;
  const admin = req.user

  try {
    const foundComment = await comment.findByPk(id);
    if (!foundComment) {
      return res.status(404).json({ success: false, message: 'Komentar tidak ditemukan' });
    }

    await foundComment.destroy();

    await log.create({
      action: 'DELETE_COMMENT',
      user_id: admin.id,
      username: admin.username,
      target_com: foundComment.id,
      description: `Admin ${adminName} menghapus komentar ID ${id}`
    });

    res.json({ success: true, message: 'Komentar berhasil dihapus' });
  } catch (err) {
    console.error('Delete Comment Error:', err);
    res.status(500).json({ success: false, message: 'Gagal menghapus komentar' });
  }
};

module.exports = {
  getAllComments,
  deleteComment
};
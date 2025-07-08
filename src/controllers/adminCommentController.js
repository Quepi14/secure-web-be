const Comment = require('../models/commentModel');
const Log = require('../models/logModel');

// Ambil semua komentar
const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.findAll();
    res.json({ success: true, data: comments });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal mengambil komentar' });
  }
};

// Edit komentar
const updateComment = async (req, res) => {
  const { id } = req.params;
  const { username, content } = req.body;
  const adminName = req.user?.username || 'Unknown Admin';

  try {
    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Komentar tidak tersedia' });
    }

    await comment.update({ username, content });

    await Log.create({
      adminUsername: adminName,
      action: 'EDIT_COMMENT',
      targetCommentId: id,
      description: `Admin ${adminName} mengedit komentar ID ${id}`,
      adminId: req.user?.id || 0
    });

    res.json({ success: true, message: 'Komentar berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui komentar' });
  }
};

// Hapus komentar
const deleteComment = async (req, res) => {
  const { id } = req.params;
  const adminName = req.user?.username || 'Unknown Admin';

  try {
    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Komentar tidak ditemukan' });
    }

    await comment.destroy();

    await Log.create({
      adminUsername: adminName,
      action: 'DELETE_COMMENT',
      targetCommentId: id,
      description: `Admin ${adminName} menghapus komentar ID ${id}`,
      adminId: req.user?.id || 0
    });

    res.json({ success: true, message: 'Komentar berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal menghapus komentar' });
  }
};

module.exports = {
  getAllComments,
  updateComment,
  deleteComment
};
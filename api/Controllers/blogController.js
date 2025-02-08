module.exports = {
	getAllPosts: (req, res) => {

		res.json({ message: "getAllPosts" });
	},
	getPostById: (req, res) => {
		
		res.json({ message: "getPostById", id: req.params.id });
	},
	createPost: (req, res) => {
		
		res.json({ message: "createPost", data: req.body });
	},
	updatePost: (req, res) => {
		
		res.json({ message: "updatePost", id: req.params.id });
	},
	deletePost: (req, res) => {
		
		res.json({ message: "deletePost", id: req.params.id });
	}
};

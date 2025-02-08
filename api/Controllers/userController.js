// userController.js
module.exports = {
	getAllUsers: (req, res) => {
		
		res.json({ message: "getAllUsers" });
	},
	getUserById: (req, res) => {

		res.json({ message: "getUserById", id: req.params.id });
	},
	createUser: (req, res) => {
		
		res.json({ message: "createUser", data: req.body });
	},
	updateUser: (req, res) => {
		
		res.json({ message: "updateUser", id: req.params.id });
	},
	deleteUser: (req, res) => {
		
		res.json({ message: "deleteUser", id: req.params.id });
	}
};

module.exports = {
	apps: [
		{
			name: "oasis_server1",
			script: "./app.js",
			env: {
				PORT: 3000,
			},
			watch: true,
		},
		{
			name: "oasis_server2",
			script: "./app.js",
			env: {
				PORT: 3001,
			},
			watch: true,
		},
		{
			name: "oasis_server3",
			script: "./app.js",
			env: {
				PORT: 3002,
			},
			watch: true,
		},
	],
};

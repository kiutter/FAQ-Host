var GET_Questions_Schema = {
	type: "object",
	required: ["_links", "_templates"],
	properties: {
		_links: {
			type: "object",
			required: ["self", "curies"],
			properties: {
				self: { href: "Link to self" },
				curies: [{ required: ["name", "href"], name: "name", href: "Apiary url" }],
				"name:relation": { type: "object", required: ["href", "type"] }
			}
		},
		_embedded: { questions: { type: "array", items: { type: "object" } } },
		_templates: {}
	}
};

module.exports = {
	GET_Questions_Schema
};

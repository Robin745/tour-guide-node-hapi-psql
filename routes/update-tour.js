"use strict";

const Joi = require("joi");
const Dao = require("../util/dao");
const uuid = require("uuid");

const payload_scheme = Joi.object({
	oid: Joi.string().allow(null, "").optional(),
	added_at: Joi.string().allow(null, "").optional(),
	description: Joi.string().allow(null, "").optional(),
	img: Joi.string().allow(null, "").optional(),
	price: Joi.number().allow(null, "").optional(),
	title: Joi.string().allow(null, "").optional(),
	// email: Joi.string().allow(null, "").optional(),
	// phone: Joi.string().allow(null, "").optional(),
	// quantity: Joi.number().allow(null, "").optional(),
	// address: Joi.string().allow(null, "").optional(),
	// price: Joi.number().allow(null, "").optional(),
});

const route_controller = {
	method: "POST",
	path: "/tours/update-tour",
	options: {
		description: "Update Tour data",
		validate: {
			payload: payload_scheme,
			options: {
				allowUnknown: false,
			},
			failAction: async (request, h, err) => {
				return h
					.response({ code: 301, status: false, message: err?.message })
					.takeover();
			},
		},
	},
	handler: async (request, h) => {
		const data = await update_data(request);
		if (!data) {
			return h.response({
				status: false,
				code: 201,
				message: "Something is wrong",
			});
		}

		return h.response({
			status: true,
			code: 200,
			message: "Data has been updated successfully",
		});
	},
};

const update_data = async (request) => {
	let query = `UPDATE tours
    SET title = '${request.payload.title}', img = '${request.payload.img}', description = '${request.payload.description}', price = ${request.payload.price}
    WHERE oid = '${request.payload.oid}' `;

	// let query = `UPDATE tours SET (oid,title,price,description,created_at,img)
	// VALUES ('${request.payload.id}', '${request.payload.title}', ${request.payload.price},'${request.payload.description}','${request.payload.added_time}','${request.payload.img}')
	// WHERE tours.oid = '${request.payload.oid}'
	// `;

	let sql = {
		text: query,
		values: [],
	};
	try {
		await Dao.execute_value(request.pg, sql);
		return true;
	} catch (e) {
		console.log(
			`An exception occurred while getting issue list : ${e?.message}`
		);
		return false;
	}
};

module.exports = route_controller;

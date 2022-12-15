"use strict";

//importing joi
const Joi = require("joi");
const Dao = require("../util/dao");

// const _ = require("underscore");
//work with local data
// const jsonfile = require("jsonfile");

//data validation
const payload_scheme = Joi.object({
	oid: Joi.string().required(),
});

const route_controller = {
	method: "POST",
	path: "/tours/get-by-oid",
	options: {
		description: "Get tours by oid",
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
		let s = await get_tours_data_by_oid(request);
		console.log(s);
		if (s) {
			return h.response(s);
		} else {
			return h.response({ code: 201, message: "Data not found" });
		}
	},
};

const get_tours_data_by_oid = async (request) => {
	// console.log(request.payload.oid);
	let data = [];
	let query = `select * from public.tours t where t.oid ='${request.payload.oid}'`;

	let sql = {
		text: query,
		values: [],
	};

	try {
		data = await Dao.get_data(request.pg, sql);
		return data[0];
	} catch (e) {
		console.log(e);
	}
	return null;
};

module.exports = route_controller;

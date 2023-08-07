'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};
const {DataTypes}  = require('sequelize')

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.e_documents_apply.hasOne(db.e_documents, {sourceKey:"docNo",foreignKey:{field:"document_no", name:"document_no"}});

db.e_documents.hasOne(db.fin_data, {sourceKey:"fin", foreignKey:{field:"e_documents_fin"}});

db.course_appeals.hasOne(db.appealed_courses ,{foreignKey:{field:"course_appeals_id"}});

db.government_agencies.hasOne(db.e_documents_apply ,{foreignKey:{field:"government_agency"}});

db.users.hasOne(db.fin_data, {sourceKey:'fin', foreignKey:{name:'fin', field:'fin'}}) ;

db.children.hasOne(db.fin_data, {sourceKey:'fin', foreignKey:{name:"children_fin", field:"children_fin"}});

db.student_appeals.hasMany(db.student_appeals_private_data, {foreignKey:{field:"student_appeal_id"}});

db.student_appeals.hasMany(db.student_appeals_parent_data, {foreignKey:{field:"student_appeal_id"}});

db.student_appeals.hasMany(db.student_appeals_common_data, {foreignKey:{field:"student_appeal_id"}});

db.users.hasMany(db.student_appeals, {foreignKey:{field:"user_id"}});

db.informal_edu_specializations.hasMany(db.informal_edu_session_specializations, {foreignKey:{field:"specialty_id"}});

db.informal_edu_appeals.hasMany(db.informal_edu_specializations, {sourceKey:'ATIS_ID', foreignKey:'ATIS_ID'});

db.informal_edu_user_modules.hasOne(db.informal_edu_module_documents, {sourceKey:"inf_education_apply_id", foreignKey:"inf_education_apply_id"});

db.informal_edu_user_modules.hasOne(db.informal_edu_status_messages, {sourceKey:"status", foreignKey:"status"});

db.informal_edu_specialty_modules.hasMany(db.informal_edu_user_modules, {foreignKey:{field:"module_id"}}) ;

db.atis_enterprises.hasMany(db.ent_sp_join, { sourceKey:"ATIS_ID", foreignKey:"enterprise_ATIS_ID" });

db.out_of_school_centers.hasMany(db.appealed_out_of_schools, {foreignKey:{field:"out_of_school_id"}});

db.appeals_out_of_school.hasMany(db.appealed_out_of_schools, {foreignKey:{field:"appeals_out_of_school_id"}});

db.dim_datas.hasOne(db.student_appeals, {sourceKey:"fin", foreignKey:"fin"});

db.dim_datas.hasOne(db.student_appeals, {sourceKey:"tur", foreignKey:"tur"});

// Dim_datas.hasOne(student_appeals, {sourceKey:"specialtyDimCode", foreignKey:"specialtyDimCode"});

db.dim_datas.hasOne(db.atis_enterprises, {sourceKey:"institutionAtisId", foreignKey:{name:"ATIS_ID", field:"ATIS_ID"}});

db.vacancy_appeals.hasMany(db.appealed_vacancies, {foreignKey:{field:"vacancy_appeals_id"}});

// db.fin_data.hasOne(db.children, {sourceKey: 'fin', foreignKey: 'fin'});

module.exports = db;

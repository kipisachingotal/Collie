module.exports = {
    departmentOptions: [
        { value: "Sales",label: "Sales"},
        { value: "Finance",label: "Finance"},
        { value: "Operations",label: "Operations"},
        { value: "Technology",label: "Technology"}
    ],
    environmentOptions: [
        { value: "Development",label: "Development"},
        { value: "UAT",label: "UAT"},
        { value: "Staging",label: "Staging"},
        { value: "Production",label: "Production"},
    ],
    accessTypeOptions: [
        { value: "RO",label: "ReadOnly"},
        { value: "RW",label: "ReadWrite"},
    ],
    privilegesList:{
        "Global":["ACCOUNT"],
        "AccountObject":["USER","DATABASE","WAREHOUSE","RESOURCE MONITOR","INTEGRATION"],
        // "Schema":["SCHEMA"],
        "SchemaObject":["TABLE","VIEW","MATERIALIZED VIEW","STREAM","SEQUENCE","FUNCTION","EXTERNAL FUNCTION","PROCEDURE","FILE FORMAT","EXTERNAL STAGE","INTERNAL STAGE","PIPE","TASK","MASKING POLICY","ROW ACCESS POLICY","SESSION POLICY","TAG"],
        database:["ALL","MODIFY","MONITOR","USAGE","CREATE SCHEMA","IMPORTED PRIVILEGES"],
        warehouse:["ALL","MODIFY", "MONITOR" ,"USAGE", "OPERATE"],
        schema:["ALL","MODIFY", "MONITOR","USAGE","CREATE TABLE","CREATE EXTERNAL TABLE",
            "CREATE VIEW","CREATE MATERIALIZED VIEW","CREATE MASKING POLICY",
            "CREATE ROW ACCESS POLICY","CREATE SESSION POLICY","CREATE TAG",
            "CREATE SEQUENCE","CREATE FUNCTION","CREATE PROCEDURE","CREATE FILE FORMAT",
            "CREATE STAGE","CREATE PIPE","CREATE STREAM","CREATE TASK"],
        table:["ALL","SELECT","INSERT","UPDATE","DELETE","TRUNCATE","REFERENCES"]
    },
    privileges:[
        {
            "ObjectLevel":"Global",
            "EXEC_ROLE":["ACCOUNTADMIN"],
            "ObjectName":"ACCOUNT",
            "InObject":[],
            "PRIVS_LIST":["CREATE DATA EXCHANGE LISTING","CREATE INTEGRATION","CREATE SHARE","APPLY MASKING POLICY","APPLY ROW ACCESS POLICY","EXECUTE TASK","IMPORT SHARE","MONITOR EXECUTION","MONITOR USAGE","OVERRIDE SHARE RESTRICTIONS"]
        },
        {
            "ObjectLevel":"Global",
            "EXEC_ROLE":["SECURITYADMIN"],
            "ObjectName":"ACCOUNT",
            "InObject":[],
            "PRIVS_LIST":["CREATE ROLE","CREATE USER","MANAGE GRANTS","CREATE NETWORK POLICY","APPLY SESSION POLICY","ATTACH POLICY"]
        },
        {
            "ObjectLevel":"Global",
            "EXEC_ROLE":["SYSADMIN"],
            "ObjectName":"ACCOUNT",
            "InObject":[],
            "PRIVS_LIST":["CREATE DATABASE","CREATE WAREHOUSE"]
        },
        {
            "ObjectLevel":"AccountObject",
            "EXEC_ROLE":["SECURITYADMIN"],
            "ObjectName":"USER",
            "InObject":[],
            "PRIVS_LIST":["MONITOR"]
        },
        {
            "ObjectLevel":"AccountObject",
            "EXEC_ROLE":["SECURITYADMIN","SYSADMIN"],
            "ObjectName":"DATABASE",
            "InObject":[],
            "PRIVS_LIST":["ALL","MODIFY","MONITOR","USAGE","CREATE SCHEMA","IMPORTED PRIVILEGES"]
        },
        {
            "ObjectLevel":"AccountObject",
            "EXEC_ROLE":["SECURITYADMIN","SYSADMIN"],
            "ObjectName":"WAREHOUSE",
            "InObject":[],
            "PRIVS_LIST":["ALL","MODIFY", "MONITOR" ,"USAGE", "OPERATE"]
        },
        {
            "ObjectLevel":"AccountObject",
            "EXEC_ROLE":["SECURITYADMIN"],
            "ObjectName":"RESOURCE MONITOR",
            "InObject":[],
            "PRIVS_LIST":["ALL","MODIFY", "MONITOR"]
        },
        {
            "ObjectLevel":"AccountObject",
            "EXEC_ROLE":["SYSADMIN"],
            "ObjectName":"INTEGRATION",
            "InObject":[],
            "PRIVS_LIST":["ALL","USAGE", "USE_ANY_ROLE"]
        },
        {
            "ObjectLevel":"DatabaseObject",
            "EXEC_ROLE":["SECURITYADMIN","SYSADMIN"],
            "ObjectName":"SCHEMA",
            "InObject":["DATABASE"],
            "PRIVS_LIST":["ALL","MODIFY", "MONITOR","USAGE","CREATE TABLE","CREATE EXTERNAL TABLE","CREATE VIEW","CREATE MATERIALIZED VIEW","CREATE MASKING POLICY","CREATE ROW ACCESS POLICY","CREATE SESSION POLICY","CREATE TAG","CREATE SEQUENCE","CREATE FUNCTION","CREATE PROCEDURE","CREATE FILE FORMAT","CREATE STAGE","CREATE PIPE","CREATE STREAM","CREATE TASK"]
        },
        {
            "ObjectLevel":"DatabaseObject",
            "EXEC_ROLE":["SECURITYADMIN","SYSADMIN"],
            "ObjectName":"ALL SCHEMAS",
            "InObject":["DATABASE"],
            "PRIVS_LIST":["ALL","MODIFY", "MONITOR","USAGE","CREATE TABLE","CREATE EXTERNAL TABLE","CREATE VIEW","CREATE MATERIALIZED VIEW","CREATE MASKING POLICY","CREATE ROW ACCESS POLICY","CREATE SESSION POLICY","CREATE TAG","CREATE SEQUENCE","CREATE FUNCTION","CREATE PROCEDURE","CREATE FILE FORMAT","CREATE STAGE","CREATE PIPE","CREATE STREAM","CREATE TASK"]
        },
        {
            "ObjectLevel":"DatabaseObject",
            "EXEC_ROLE":["SECURITYADMIN","SYSADMIN"],
            "ObjectName":"ALL TABLES",
            "InObject":["DATABASE"],
            "PRIVS_LIST":["ALL","SELECT","INSERT","UPDATE","DELETE","TRUNCATE","REFERENCES"]
        },
        {
            "ObjectLevel":"DatabaseObject",
            "EXEC_ROLE":["SECURITYADMIN","SYSADMIN"],
            "ObjectName":"FUTURE SCHEMAS",
            "InObject":["DATABASE"],
            "PRIVS_LIST":["ALL","MODIFY", "MONITOR","USAGE","CREATE TABLE","CREATE EXTERNAL TABLE","CREATE VIEW","CREATE MATERIALIZED VIEW","CREATE MASKING POLICY","CREATE ROW ACCESS POLICY","CREATE SESSION POLICY","CREATE TAG","CREATE SEQUENCE","CREATE FUNCTION","CREATE PROCEDURE","CREATE FILE FORMAT","CREATE STAGE","CREATE PIPE","CREATE STREAM","CREATE TASK"]
        },
        {
            "ObjectLevel":"SchemaObject",
            "EXEC_ROLE":["SECURITYADMIN","SYSADMIN"],
            "ObjectName":"TABLE",
            "InObject":["DATABASE","SCHEMA"],
            "PRIVS_LIST":["ALL","SELECT","INSERT","UPDATE","DELETE","TRUNCATE","REFERENCES"]
        },
        {
            "ObjectLevel":"SchemaObject",
            "EXEC_ROLE":["SECURITYADMIN","SYSADMIN"],
            "ObjectName":"ALL TABLES",
            "InObject":["DATABASE","SCHEMA"],
            "PRIVS_LIST":["ALL","SELECT","INSERT","UPDATE","DELETE","TRUNCATE","REFERENCES"]
        },
        {
            "ObjectLevel":"SchemaObject",
            "EXEC_ROLE":["SECURITYADMIN","SYSADMIN"],
            "ObjectName":"FUTURE TABLES",
            "InObject":["DATABASE","SCHEMA"],
            "PRIVS_LIST":["ALL","SELECT","INSERT","UPDATE","DELETE","TRUNCATE","REFERENCES"]
        },
        {
            "ObjectLevel":"SchemaObject",
            "EXEC_ROLE":["SECURITYADMIN","SYSADMIN"],
            "ObjectName":"VIEW",
            "InObject":["DATABASE","SCHEMA"],
            "PRIVS_LIST":["ALL","SELECT","REFERENCES"]
        },
        {
            "ObjectLevel":"SchemaObject",
            "EXEC_ROLE":["SECURITYADMIN","SYSADMIN"],
            "ObjectName":"MATERIALIZED VIEW",
            "InObject":["DATABASE","SCHEMA"],
            "PRIVS_LIST":["ALL","SELECT"]
        },
        {
            "ObjectLevel":"SchemaObject",
            "EXEC_ROLE":["SECURITYADMIN","SYSADMIN"],
            "ObjectName":"STREAM",
            "InObject":["DATABASE","SCHEMA"],
            "PRIVS_LIST":["ALL","SELECT"]
        },
        {
            "ObjectLevel":"SchemaObject",
            "EXEC_ROLE":["SECURITYADMIN","SYSADMIN"],
            "ObjectName":"SEQUENCE",
            "InObject":["DATABASE","SCHEMA"],
            "PRIVS_LIST":["ALL","USAGE"]
        },
        {
            "ObjectLevel":"SchemaObject",
            "EXEC_ROLE":["SECURITYADMIN","SYSADMIN"],
            "ObjectName":"FUNCTION",
            "InObject":["DATABASE","SCHEMA"],
            "PRIVS_LIST":["ALL","USAGE"]
        },
        {
            "ObjectLevel":"SchemaObject",
            "EXEC_ROLE":["SECURITYADMIN","SYSADMIN"],
            "ObjectName":"EXTERNAL FUNCTION",
            "InObject":["DATABASE","SCHEMA"],
            "PRIVS_LIST":["ALL","USAGE"]
        },
        {
            "ObjectLevel":"SchemaObject",
            "EXEC_ROLE":["SECURITYADMIN","SYSADMIN"],
            "ObjectName":"PROCEDURE",
            "InObject":["DATABASE","SCHEMA"],
            "PRIVS_LIST":["ALL","USAGE"]
        },
        {
            "ObjectLevel":"SchemaObject",
            "EXEC_ROLE":["SECURITYADMIN","SYSADMIN"],
            "ObjectName":"FILE FORMAT",
            "InObject":["DATABASE","SCHEMA"],
            "PRIVS_LIST":["ALL","USAGE"]
        },
        {
            "ObjectLevel":"SchemaObject",
            "EXEC_ROLE":["SECURITYADMIN","SYSADMIN"],
            "ObjectName":"EXTERNAL STAGE",
            "InObject":["DATABASE","SCHEMA"],
            "PRIVS_LIST":["ALL","USAGE"]
        },
        {
            "ObjectLevel":"SchemaObject",
            "EXEC_ROLE":["SECURITYADMIN","SYSADMIN"],
            "ObjectName":"INTERNAL STAGE",
            "InObject":["DATABASE","SCHEMA"],
            "PRIVS_LIST":["ALL","READ","WRITE"]
        },
        {
            "ObjectLevel":"SchemaObject",
            "EXEC_ROLE":["SECURITYADMIN","SYSADMIN"],
            "ObjectName":"PIPE",
            "InObject":["DATABASE","SCHEMA"],
            "PRIVS_LIST":["ALL","MONITOR","OPERATE"]
        },
        {
            "ObjectLevel":"SchemaObject",
            "EXEC_ROLE":["SECURITYADMIN","SYSADMIN"],
            "ObjectName":"TASK",
            "InObject":["DATABASE","SCHEMA"],
            "PRIVS_LIST":["ALL","MONITOR","OPERATE"]
        },
        {
            "ObjectLevel":"SchemaObject",
            "EXEC_ROLE":["SECURITYADMIN","SYSADMIN"],
            "ObjectName":"MASKING POLICY",
            "InObject":["DATABASE","SCHEMA"],
            "PRIVS_LIST":["ALL","APPLY"]
        },
        {
            "ObjectLevel":"SchemaObject",
            "EXEC_ROLE":["SECURITYADMIN","SYSADMIN"],
            "ObjectName":"ROW ACCESS POLICY",
            "InObject":["DATABASE","SCHEMA"],
            "PRIVS_LIST":["ALL","APPLY"]
        },
        {
            "ObjectLevel":"SchemaObject",
            "EXEC_ROLE":["SECURITYADMIN","SYSADMIN"],
            "ObjectName":"SESSION POLICY",
            "InObject":["DATABASE","SCHEMA"],
            "PRIVS_LIST":["ALL","APPLY"]
        },
        {
            "ObjectLevel":"SchemaObject",
            "EXEC_ROLE":["SECURITYADMIN","SYSADMIN"],
            "ObjectName":"TAG",
            "InObject":["DATABASE","SCHEMA"],
            "PRIVS_LIST":["ALL","APPLY"]
        }
    ]
}
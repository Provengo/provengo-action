/* @provengo summon rest */
//@provengo summon rtv

let defaultProps1 = {headers:{"content-type": "text/plain" , "header1": "header-1"}};
let defaultProps2 = {headers:{"content-type": "application/json" , "header2": "header-2"}};

var session1 = new RESTSession(url, "echo-server-1", defaultProps1);

var session2 = new RESTSession(url, "echo-server-2", defaultProps2);

const API_KEY = "12345678-EEEE-3333-2222-111111111111";
const API_KEY_READY = Event("API_KEY_READY");

/*
** JS Trick explanation: ~~NUM is a trick to convert a float to an integer. It is equivalent to Math.floor(NUM).
** (Technically it's performing bitwise NOT twice)
*/

bthread("header 1", function(){
    session1.post("/echo-api", {
            parameters: {"code": "200"},
            body: JSON.stringify({"apiKey": "@{String(~~(Math.random()*10000))}"}),
            expectedResponseCodes: [200],
            callback: function(r){
                pvg.log.info("verify-info-pvg-object"); // messages used for validation,
                pvg.log.warn("verify-warn-pvg-object"); // do not change!
                pvg.log.error("verify-error-pvg-object");
                pvg.log.fine("verify-fine-pvg-object");
                let body = JSON.parse(r.body);
                pvg.rtv.set("apiKey", body.apiKey);
                pvg.success("good")
            }
        })
})

bthread("header 2", function(){
    session2.post("/echo-api", {
            parameters: {"code":"201", "ping":"pong" },
            body: JSON.stringify({"apiKey": "@{String(~~(Math.random()*10000))}"}),
            callback: function(r){
                            let body = JSON.parse( r.body );
                            pvg.rtv.set("apiKey", body.apiKey);
                            // pvg.success();
                        }
    });
    const key = "1000";
    session2.post("/echo-api", {
            parameters: {"code":"301", "ping":"pong" },
            expectedResponseCodes: [301],
            body: JSON.stringify({"apiKey": key}),
            callback: function(r){
                            let body = JSON.parse( r.body );
                            pvg.rtv.set("apiKey_c", body.apiKey);
                            if(r.code != 301){
                                pvg.fail("response code was: '" + r.code + "' instead of '301'")
                            }
                        }
    });
    rtv.assertEq("@{apiKey_c}", key);
});

//bthread("sample Process", function(){
//
//    session1.post(
//        "/echo-api",
//        {
//            header: {"content-type": "text/plain" , "header1": "header-1"},
//            parameters: {"code": "200"},
//            body: JSON.stringify({"apiKey": "@{String(~~(Math.random()*10000))}"}),
//            expected_ret_codes: [200],
//            validateResponseFunction: function(r, rtvStore){
//                            let body = JSON.parse(r.body);
//                            rtvStore.set("apiKey", body.apiKey);
//                        }
//        }
//    );
//    request(API_KEY_READY);
//});
//
//bthread("get", function(){
//    waitFor(API_KEY_READY);
//    session.get(    // (url, header, parameters, expected_ret_codes, validateResponseFunction, runtimeVarStoreInstructions)
//        "/echo-api",
//        {
//            header: {"content-type": "application/json", "api-key": "@{apiKey}"},
//            parameters: {"code": "201"},
//            expected_ret_codes: [201]
//        }
//    );
//});
//
//bthread("line 1", function(){
//    waitFor(API_KEY_READY);
//    session.put(    // post = function (url, header, parameters, body, expected_ret_codes, validateResponseFunction, runtimeVarStoreInstructions)
//        "/echo-api",
//        {
//            header: {"content-type": "application/json" , "api-key": "@{apiKey}"},
//            parameters: {"code": "200"},
//            body: '{}',
//            expected_ret_codes: [200]
//        }
//    );
//
//    session.head(    // (url, header, parameters, expected_ret_codes, validateResponseFunction, runtimeVarStoreInstructions)
//        "/echo-api",
//        {
//            header: {"content-type": "application/json" , "api-key": "@{apiKey}"},
//            parameters:{"code": "200"},
//            expected_ret_codes: [200]
//        }
//    );
//
//    session.delete(    // (url, header, parameters, expected_ret_codes, validateResponseFunction, runtimeVarStoreInstructions)
//        "/echo-api",
//        {
//            header:{"content-type": "application/json" , "api-key": "@{apiKey}"},
//            parameters: {"code": "200"},
//            expected_ret_codes: [200]
//        }
//    );
//});
//
//bthread("line 2", function(){
//    waitFor(API_KEY_READY);
//    session.options(    // (url, header, parameters, expected_ret_codes, validateResponseFunction, runtimeVarStoreInstructions)
//        "/echo-api",
//        {
//            header: {"content-type": "application/json" , "api-key": "@{apiKey}"},
//            parameters: {"code": "200"},
//            expected_ret_codes: [200]
//        }
//    );
//
//    session.patch(    // post = function (url, header, parameters, body, expected_ret_codes, validateResponseFunction, runtimeVarStoreInstructions)
//        "/echo-api",
//        {
//            header: {"content-type": "application/json" , "api-key": "@{apiKey}"},
//            parameters: {"code": "200"},
//            body: '{"h": 6}',
//            expected_ret_codes: [200]
//        }
//    );
//});

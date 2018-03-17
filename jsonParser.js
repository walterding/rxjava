/**
 * Created by hinotohui on 18/3/16.
 */

//基于下推自动机完成的json文法解析
/*
 文法
 program =>{objstmt}$
 objstmt =>objstmt,obj
 objstmt =>obj
 obj =>$id:$id
     =>$id:{objstmt}
     =>$id:{}
 $id =>"items"
 items =>items item
       =>item
 item =>id
      =>:
      =>,
      =>{
      =>}

 */

var reserves=[':','{','}',',','"']

function scan(str){
    var index=0;

    return function(){

        for(;index<str.length;index++){
            if(str[index]!=' ') {
                break
            }
        }

        if (index>=str.length){
            return ['$','$']
        }

        switch(str[index]){
            case '{':index++;return ['{','{']
            case '}':index++;return ['}','}']
            case ':':index++;return [':',':']
            case ',':index++;return [',',',']
            case '"':index++;return ['"','"']
            default:
                var items=[]

                for(;index<str.length;index++){
                    if(reserves.includes(str[index])) {
                        break
                    }
                    items[items.length]=str[index]
                }

                return ['id',items.join('')]
        }
    }
}

var state9={}

var state8={
    'index':8,',':{
        'action':function (data) {

        },
        'state':()=>{return state1}
    },'$':{
        'action':function (data) {
            state9.result=results.pop()
        },
        'state':()=>{return state9}
    },"}":{
        'action':function (data) {
            if(tags.length!=0) {
                var result = results.pop()
                results[results.length - 1][tags.pop()] = result
            }
        },
        'state':()=>{return state8}
    }
}

var state7={'index':7,'"':{
    'action':function (data) {
        var result=results[results.length-1]

        var value=tags.pop()
        var key=tags.pop()

        result[key]=value
    },
    'state':()=>{return state8}
    },':':{
    'action':function (data) {
        tags[tags.length-1]=tags[tags.length-1]+':'
    },
    'state':()=>{return state7}
    },',':{
    'action':function (data) {
        tags[tags.length-1]=tags[tags.length-1]+','
    },
    'state':()=>{return state7}
    },'{':{
    'action':function (data) {
        tags[tags.length-1]=tags[tags.length-1]+'{'
    },
    'state':()=>{return state7}
    },'}':{
    'action':function (data) {
        tags[tags.length-1]=tags[tags.length-1]+'}'
    },
    'state':()=>{return state7}
    },'id':{
    'action':function (data) {
        tags[tags.length-1]=tags[tags.length-1]+data[1]
    },
    'state':()=>{return state7}
    }
}

var state6={'index':6,'id':{
    'action':function (data) {
        var id=data[1]
        tags[tags.length]=id
    },
    'state':()=>{return state7}
    }
}

var state5={'index':5,'"':{
    'action':function (data) {

    },
    'state':()=>{return state6}
}, '{':{
    'action':function (data) {
        results[results.length]={}
    },
    'state':()=>{return state1}
    },
}

var state4={'index':4,':':{
    'action':function (data) {

    },
    'state':()=>{return state5}
    }
}
var state3={'index':3,'"':{
    'action':function (data) {

    },
    'state':()=>{return state4}
    },':':{
    'action':function (data) {
        tags[tags.length-1]=tags[tags.length-1]+':'
    },
    'state':()=>{return state4}
    },',':{
    'action':function (data) {
        tags[tags.length-1]=tags[tags.length-1]+','
    },
    'state':()=>{return state4}
    },'{':{
    'action':function (data) {
        tags[tags.length-1]=tags[tags.length-1]+'{'
    },
    'state':()=>{return state4}
    },'}':{
    'action':function (data) {
        tags[tags.length-1]=tags[tags.length-1]+'}'
    },
    'state':()=>{return state4}
    },'id':{
    'action':function (data) {
        tags[tags.length-1]=tags[tags.length-1]+data[1]
    },
    'state':()=>{return state4}
    }
}

var state2={'index':2,'id':{
    'action':function (data) {
        var id=data[1]
        tags[tags.length]=id
    },
    'state':()=>{return state3}
    }
}
var state1={'index':1,'"':{
    'action':function (data) {

    },
    'state':()=>{return state2}
    },'}':{
    'action':function (data) {
        if(tags.length!=0) {
            var result = results.pop()
            results[results.length - 1][tags.pop()] = result
        }
    },
    'state':()=>{return state8}
},
}

var state0={'index':0,'{':{
    'action':function (data) {
        results[results.length]={}

    },
    'state':()=>{return state1}
    }
}

var results=[]
var tags=[]

var lexer=scan('{"data":{"data":"data","data1":"data1","data3":{"data4":"data4:}"},"data5":"data5"}}')

var current=state0;

while(current!=state9){
    var key=lexer()

    var action=current[key[0]]['action']

    action(key)
    current=current[key[0]]['state']()

}
var data=state9.result
console.log(data)

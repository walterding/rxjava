<!doctype html>
<html>
<head>
	<style type="text/css">
	#test {
		height: 300px;
		background-color: red
	}
	</style>
</head>
<body>
	<div id="test"> {{name}}   <div>
		         {{name}}123
		         <p>{{name}}</p>
		</div>
		{{name}}<em>{{name}}</em>
	</div>
</body>
</html>

<script type="text/javascript">
	/**
 * Created by hinotohui on 18/6/6.
 */
function VNode(name,type,parent,textContent,el,context,attrs={}){

    this.name=name
    this.type=type
    this.parent=parent
    this.el=el
    this.attrs=attrs
    this.childs=[]
    this.textContent=textContent
    this.context=context

    //trick
    if(this.type=='text'&&textContent){
        let group=textContent.match(/{{(.+?)}}/)
        if(group){
            if(!context[group[1].trim()])
                context[group[1].trim()]=[]
            context[group[1].trim()].push((function(that){

                let placeHolder=group[0]

                return function(value){
                    that.el.textContent=that.textContent.replace(placeHolder,value)
                }
            })(this))
        }
    }
}

VNode.prototype.addChild=function (child){
    this.childs.push(child)
}

function createTextNode(textContent,start,end){
    return {
        'type':'text',
        'name':'text',
        'textContent':textContent,
        'tagType':0,
        'attrs':{}
    }
}

function createElementNode(tagContent,tagType,start,end) {

    let offset=tagContent.indexOf(' ')
    let name=(offset==-1)?tagContent:tagContent.substring(0,offset)

    let attrs={}

    let items=tagContent.match(/[^\s]+\s*=\s*['|"].+?['|"]/g)||[]

    items.forEach((item)=>{
        let kv=item.split('=')
        attrs[kv[0].trim()]=kv[1].substring(1,kv[1].length-1).trim()
    })

    return {
        type:'element',
        name:name,
        tagType:tagType,
        attrs:attrs,
        textContent:(tagType==0?'<':'</')+tagContent+'>'
    }
}

function toNodeList(html){
    let offset=0
    let vNodeList=[]

    while (1){
        let start=html.indexOf('<',offset)

        if (start==-1)
            break

        if(start>offset){
            let textContent=html.substring(offset,start)

            vNodeList.push(createTextNode(textContent))

            offset=start
        }else{
            let end=html.indexOf('>',offset)

            if(html.charAt(start+1)!='/'){
                let tagContent=html.substring(start+1,end)

                vNodeList.push(createElementNode(tagContent,0))
            }else{
                let tagContent=html.substring(start+2,end)

                vNodeList.push(createElementNode(tagContent,1))
            }

            offset=end+1
        }

        if(offset>=html.length)
            break
    }

    return vNodeList
}

function parseHtml(html,el,context={}){
    let vStack=[]
    let elStack=[]

    let vNodeList=toNodeList(html)

    let root

    for(let i=0;i<vNodeList.length;i++){
        if(vNodeList[i].tagType==0){

            if(vStack.length==0){
                let vNode=new VNode(vNodeList[i].name,vNodeList[i].type,
                    null,vNodeList[i].textContent,el,context,vNodeList[i].attrs)
                root=vNode

                vStack.push(vNode)
                elStack.push(el)
            }else{
                let vNode=new VNode(vNodeList[i].name,vNodeList[i].type,
                    vStack[vStack.length-1],vNodeList[i].textContent,elStack[elStack.length-1]
                        .childNodes[vStack[vStack.length-1].childs.length],context,vNodeList[i].attrs)


                elStack.push(elStack[elStack.length-1]
                    .childNodes[vStack[vStack.length-1].childs.length])

                vStack[vStack.length-1].addChild(vNode)
                vStack.push(vNode)
            }

            if(vNodeList[i].type=='text'){
                vStack.pop()
                elStack.pop()
            }
        }else{
            vStack.pop()
            elStack.pop()
        }
    }

    return root
}


function Vue(opt) {
    let el=document.getElementById(opt.el)
    this.context={}

    this.context['vRoot']=parseHtml(el.outerHTML,el,this.context)

    let data=opt.data

    for(let k in data){
        let callback=this.context[k]||[]

        Object.defineProperty(this,k,{
            enumerable: true,
            configurable: true,
            set:function (value) {
                callback.forEach((f)=>{f(value)})
            }
        })

        this[k]=data[k]
    }
}

let vm=new Vue({
    'el':'test',
    data:{
        'name':'jack'
    }
})

setTimeout(()=>{
    vm.name='dinghui'
},1000)

</script>

/**
 * Created by hinotohui on 18/6/15.
 */
 //全排列非递归
class BitSet{
    constructor(bitSet){
        this.offset=0
        this.bitSet=bitSet
    }

    clone(){
        return new BitSet(this.bitSet.slice(0))
    }

    find(){
        let i=this.offset
        for(;i<this.bitSet.length;i++){
            if(this.bitSet[i]==0)
                break
        }
        this.offset=i+1
        return (this.offset>this.bitSet.length)?-1:i
    }

    set(i){
        this.bitSet[i]=1
    }

    get(){
        return this.bitSet
    }
}

function perm(a){
    let mask=new Array(a.length)

    for(let i=0;i<mask.length;i++){
        mask[i]=0
    }

    let permSet=[]
    permSet.push({value:'',mask:new BitSet(mask)})

    for (let i=0;i<a.length;i++){
        let set=[]
        for(let j=0;j<permSet.length;j++){
            let permResult=permSet[j]

            for(let k=0;k<a.length-i;k++){
                let mask=permResult.mask.clone()
                let offset=permResult.mask.find()
                mask.set(offset)
                set.push({value:(permResult.value+a[offset]),mask:mask})
            }
        }
        permSet=set
    }

    permSet.forEach((item)=>{
        console.log(item.value)
    })

    console.log(permSet.length)
}

perm(['1','2','3','4','5','6'])


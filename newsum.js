/**
 * Created by hinotohui on 18/5/22.
 */
//在一个无序数列中选取任意子数列使得和为指定数字，关键点在状态空间和转化为搜索问题的思想

status=[]//状态空间

/*
{
value:1
record:[]
}
 */

function b(i,data,dest){

    if(status.length<=i)
        status.push([])

    if(i==0){
        let record={'value':data,'records':[data]}
        if(data==dest)
            console.log(JSON.stringify(record))
        status[i].push(record)
    }else{

        let j=i-1
        while(j>=0){
            for (let k in status[j]){

                let record={'value':status[j][k]['value']+data,'records':
                    status[j][k]['records'].concat(data)}


                status[j+1].push(record)

                if(status[j][k]['value']+data==dest){
                    console.log(JSON.stringify(record))
                }

            }

            j--

        }

        let record={'value':data,'records':[data]}
        if(data==dest)
            console.log(JSON.stringify(record))

        status[0].push(record)
    }
}

function sum(a,dest){
    for(let i in a){

        b(i,a[i],dest)
    }
}

sum([5,4,7,9,3,1,11,2,10,6,-1],12)






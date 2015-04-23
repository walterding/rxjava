package com.sogou.sogouscenesearch.utils;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.TimeUnit;


/**
 * Created by hinotohui on 15-4-23.
 */
public class Looper {
    private final static int DURATION=5;

    private final static ThreadLocal<Looper> sThreadLocal=new ThreadLocal<Looper>();

    private ArrayBlockingQueue<Integer> mQueue;
    private Thread mThread;

    public Handler handler;

    private Looper(){
        mQueue=new ArrayBlockingQueue<Integer>(100);
        mThread=Thread.currentThread();
    }

    public static void prepare(){
        sThreadLocal.set(new Looper());
    }

    public static void loop(){
        Looper looper=sThreadLocal.get();
        ArrayBlockingQueue<Integer> mQueue=looper.mQueue;

        while (!looper.mThread.isInterrupted()){
            try {

                Integer integer=mQueue.poll(DURATION, TimeUnit.SECONDS);

                if(integer!=null&&looper.handler!=null)
                    looper.handler.handleMessage(integer);

            } catch (InterruptedException e) {
                e.printStackTrace();
                Thread.interrupted();
            }
        }
    }

    public void send(Integer integer){
        if(mQueue!=null){
            try {
                mQueue.offer(integer,DURATION,TimeUnit.SECONDS);
            } catch (InterruptedException e) {
                e.printStackTrace();
                Thread.interrupted();
            }
        }
    }

    public void setHandler(Handler handler){
        this.handler=handler;
    }

    public static Looper getLooper(){
        return sThreadLocal.get();
    }
}

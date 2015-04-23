package com.sogou.sogouscenesearch.utils;

/**
 * Created by hinotohui on 15-4-23.
 */
public class Handler implements Callback{
    private Looper looper;

    public Handler(Looper looper){
        this.looper=looper;
        looper.setHandler(this);
    }

    public void sendMessage(Integer integer){
        System.out.println("ThreadID:\t"+Thread.currentThread().getId());
        looper.send(integer);
    }

    @Override
    public void handleMessage(Integer message) {
        System.out.println("ThreadID:\t"+Thread.currentThread().getId());
        System.out.println(message);
    }
}

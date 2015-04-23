package com.sogou.sogouscenesearch.utils;


/**
 * Created by hinotohui on 15-4-23.
 */
public class ActiveThread extends Thread{
    private Looper looper;
    private Handler handler;
    private Object lock=new Object();

    public ActiveThread(){
        super();
    }

    @Override
    public void run() {
        //super.run();
        System.out.println("HandlerThread Start");
        Looper.prepare();

        synchronized (lock) {
            looper = Looper.getLooper();
            lock.notify();
        }

        Looper.loop();
    }

    public Looper getLooper() {
        synchronized (lock){
           if(looper==null) {
               try {
                   lock.wait();
               } catch (InterruptedException e) {
                   e.printStackTrace();
               }
           }
        }

        return looper;
    }

    public static void main(String[] args){
        ActiveThread thread=new ActiveThread();
        thread.start();

        Looper looper=thread.getLooper();
        if (looper!=null){
            Handler handler=new Handler(looper);

            handler.sendMessage(1);
            handler.sendMessage(2);
        }
    }
}

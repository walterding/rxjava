package org.rxjava;

/**
 * Created by hinotohui on 17/2/14.
 */
public interface Subscriber<T> {
    public void onNext(T t);
    public void onComplete();
    public void onError(Throwable t);
}

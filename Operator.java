package org.rxjava;

/**
 * Created by hinotohui on 17/2/14.
 */
public interface Operator<U, V> {
    Subscriber<V> operate(Subscriber<? super U> u);
}

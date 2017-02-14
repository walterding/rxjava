package org.rxjava;

/**
 * Created by hinotohui on 17/2/14.
 */
public interface IFunc<U,V> {
    V call(U u);
}

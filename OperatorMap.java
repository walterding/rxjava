package org.rxjava;

/**
 * Created by hinotohui on 17/2/14.
 */
public class OperatorMap<U,V> implements Operator<V,U> {
    private IFunc<? super U,? extends V> transform;

    public OperatorMap(IFunc<? super U, ? extends V> transform) {
        this.transform = transform;
    }

    @Override
    public Subscriber<U> operate(final Subscriber<? super V> subscriber) {
        return new Subscriber<U>() {
            @Override
            public void onNext(U u) {
                subscriber.onNext(transform.call(u));
            }

            @Override
            public void onComplete() {
            }

            @Override
            public void onError(Throwable t) {

            }
        };
    }
}

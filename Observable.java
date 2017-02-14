package org.rxjava;

/**
 * Created by hinotohui on 17/2/14.
 */
public class Observable {

    private OnSubcribe onSubcribe;
    private Subscriber subscriber;

    public <U,V> Observable lift(final Observable preObservable,
                                 final Operator<V, U>
                                         operator){
        return new Observable(new OnSubcribe<V>() {
            @Override
            public void call(Subscriber<? super V> subscriber) {
                preObservable.onSubcribe.call(operator
                        .operate(subscriber));
            }
        });
    }

    public <U,V> Observable map(IFunc<U,V> fun){
        OperatorMap operatorMap = new OperatorMap(fun);
        Observable observable = lift(this,operatorMap);
        return observable;
    }

    public <T> Observable attach(Subscriber<T> subscriber){
        this.subscriber=subscriber;
        return this;
    }

    public <T> void subscribe(Subscriber<T> subscriber){
        if (onSubcribe!=null)
            onSubcribe.call(subscriber);
    }

    public void execute(){
        if (onSubcribe!=null&&subscriber!=null)
            onSubcribe.call(subscriber);
    }

    private Observable(OnSubcribe onSubcribe){
        this.onSubcribe=onSubcribe;
    }

    public interface OnSubcribe<T>{
        void call(Subscriber<? super T> subscriber);
    }


    public static <T> Observable create(OnSubcribe<T> onSubcribe){
        return new Observable(onSubcribe);
    }

    public static void main(String[] args){
        Observable.create(new OnSubcribe<String>() {
            @Override
            public void call(Subscriber<? super String> subscriber) {
                String update = "update";
                subscriber.onNext(update);
            }
        }).map(new IFunc<String, String>() {
            @Override
            public String call(String o) {
                return o+"123";
            }
        }).attach(new Subscriber<Object>() {
            @Override
            public void onNext(Object o) {
                System.out.println((String) o);
                onComplete();
            }

            @Override
            public void onComplete() {
                System.out.println("end");
            }

            @Override
            public void onError(Throwable t) {

            }
        });
    }
}

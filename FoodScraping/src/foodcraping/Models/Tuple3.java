package foodcraping.Models;

public class Tuple3<T, TT, TTT> {
    
    private T first_;
    private TT second_;
    private TTT third_;
    
    public Tuple3(T first, TT second, TTT thrid) {
        first_ = first;
        second_ = second;
        third_ = thrid;
    }
    
    public T getFirst() {
        return first_;
    }
    
    public TT getSecond() {
        return second_;
    }
    
    public TTT getThird() {
        return third_;
    }
    
    public void setFirst(T first) {
        first_ = first;
    }
    
    public void setSecond(TT second) {
        second_ = second;
    }
    
    public void setThird(TTT third) {
        third_ = third;
    }

}

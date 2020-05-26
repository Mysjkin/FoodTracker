package foodcraping.Models;

public class Tuple4<T, TT, TTT, TTTT> {
    private T first_;
    private TT second_;
    private TTT third_;
    private TTTT fourth_;
    
    public Tuple4(T first, TT second, TTT thrid, TTTT fourth) {
        first_ = first;
        second_ = second;
        third_ = thrid;
        fourth_ = fourth;
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
    
    public TTTT getFourth() {
        return fourth_;
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
    
    public void setFourth(TTTT fourth) {
        fourth_ = fourth;
    }
    
    @Override
    public String toString() {
        return String.format("%s : %s : %s : %s", first_, second_, third_, fourth_);
    }
}

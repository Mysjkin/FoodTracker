package foodcraping.Models;

public class Tuple5<T, TT, TTT, TTTT, TTTTT> {
    private T first_;
    private TT second_;
    private TTT third_;
    private TTTT fourth_;
    private TTTTT fifth_;
    
    public Tuple5(T first, TT second, TTT thrid, TTTT fourth, TTTTT fifth) {
        first_ = first;
        second_ = second;
        third_ = thrid;
        fourth_ = fourth;
        fifth_ = fifth;
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
    
    public TTTTT getFifth() {
        return fifth_;
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
    
    public void setFifth(TTTTT fifth) {
        fifth_ = fifth;
    }
}

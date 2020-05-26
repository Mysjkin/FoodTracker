package foodcraping.Models;

public class Pair<T, TT> {
	
	private T first_;
	private TT second_;
	
	public Pair(T first, TT second) {
		first_ = first;
		second_ = second;
	}
	
	public T getFirst() {
		return first_;
	}
	
	public TT getSecond() {
		return second_;
	}
	
	public void setFirst(T first) {
		first_ = first;
	}
	
	public void setSecond(TT second) {
		second_ = second;
	}

}

public class test {
    public static void main(String[] args){
        int[] ar = new int[] {17,13,11,2,3,5,7};
        System.out.println(deckRevealedIncreasing(ar));
    }
    public int[] deckRevealedIncreasing(int[] deck) {
       List<Integer> res = new ArrayList<Integer>();
        for (int i=0;i<deck.length;i++){
            res.add(deck[i]);
        }
        
        Collections.sort(res);
        System.out.println(res);
        int adt = 0;
        int ind = res.size()/2;

        int interval = 0;
        System.out.println(ind);
        
        for(int i=0; i<res.size()/2-1;i++){
            int temp = 0;
            if (i == 0){
                interval++;
                continue;
            }
            else if (i%2 == 0){
                if (interval>0)
                    res.add(i+1*2, res.remove(i+ind));
                else
                    res.add(i+1*2, res.remove(i+ind+2));
            }
            else {
                if (interval>0){
                    res.add(i+1, res.remove(i+ind+2));
                }else{
                    res.add(i+1, res.remove(i+ind));
                }
            }
            interval++;
            if (interval > 1)
                interval = 0;
        }
        int[] arr = new int[res.size()];

        for(int i = 0; i < res.size(); i++) {
            if (res.get(i) != null) {
                arr[i] = res.get(i);
            }
        }
        return arr;
    }
}
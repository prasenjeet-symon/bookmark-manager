import Header from "@/components/shared/Header/Header";
import { Button } from "@/components/ui/button";
import { singleCall } from "@/datasource/http/http.manager";
import { NetworkApi } from "@/datasource/network.api";

export default function HomePage() {


  return (
    <div>
      <Header />
      <h1>HomePage</h1>
      <Button onClick={()=>{
        singleCall(new NetworkApi().subscribeToPremium());
      }}>Subscribe</Button>

      {/* Cancel */}
      <Button onClick={()=>{
        singleCall(new NetworkApi().cancelSubscription());
      }} color="red">Cancel</Button>
    </div>
  );
}

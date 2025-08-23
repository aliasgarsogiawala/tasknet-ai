import { Button } from "../components/ui/button";
import Tasks from "../components/tasknest/tasks";
import { signInAction } from "../../actions/auth-action";


export default function Home() {
  return (
      <main className="flex flex-col items-center justify-between p-24">
        <h1>Login</h1>
        


        

        <form action={signInAction}>
        <Button>Click here</Button>
        </form>
      </main>
      
     
  );
}

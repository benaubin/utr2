import { useRecoilState, useRecoilValue } from "recoil";
import { uniqueQuery } from "./schedule";
import { wishlistState } from "./state";

export default function WishlistDisplay() {
  const [wishlist] = useRecoilState(wishlistState);

  return (
    <div>
      <h2>Wishlist:</h2>
      {wishlist.map((unique) => {
        return (
          <div key={unique.unique}>
            <p>
              {unique.unique} {unique.course}
            </p>
          </div>
        );
      })}
    </div>
  );
}

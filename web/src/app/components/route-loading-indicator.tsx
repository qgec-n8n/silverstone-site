import { useNavigation } from "react-router";

export function RouteLoadingIndicator() {
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";

  return (
    <div aria-live="polite" className="contents" role="status">
      {isLoading ? (
        <>
          <div aria-hidden="true" className="ss-route-beam">
            <span className="ss-route-beam__pulse" />
          </div>
          <span className="sr-only">Loading page…</span>
        </>
      ) : null}
    </div>
  );
}

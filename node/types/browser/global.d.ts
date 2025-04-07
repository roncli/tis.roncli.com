import BadRequestView from "../../public/views/400"
import DirectoryView from "../../public/views/directory"
import Encoding from "../../public/js/encoding"
import IndexView from "../../public/views"
import MethodNotAllowedView from "../../public/views/405"
import NotFoundView from "../../public/views/404"
import SearchView from "../../public/views/search"
import ServerErrorView from "../../public/views/500"
import TooManyRequestsView from "../../public/views/429"

export {}

declare global {
    interface Window {
        BadRequestView: typeof BadRequestView
        DirectoryView: typeof DirectoryView
        Encoding: typeof Encoding
        MethodNotAllowedView: typeof MethodNotAllowedView
        NotFoundView: typeof NotFoundView
        IndexView: typeof IndexView
        SearchView: typeof SearchView
        ServerErrorView: typeof ServerErrorView
        TooManyRequestsView: typeof TooManyRequestsView
    }
}

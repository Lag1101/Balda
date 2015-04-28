#include <nan.h>

#include "WordTree.h"

using namespace v8;

Node root;
NAN_METHOD(Clear) {
    NanScope();

    root.clear();

    NanReturnUndefined();
}
NAN_METHOD(Add) {
  NanScope();
    if (args.Length() < 1) {
        NanThrowTypeError("Wrong number of arguments");
        NanReturnUndefined();
    }

    if (!args[0]->IsString() ) {
        NanThrowTypeError("Wrong arguments");
        NanReturnUndefined();
    }

    std::string word(*String::Utf8Value(args[0]->ToString()));
    root.add(word);

    NanReturnUndefined();
}

NAN_METHOD(Exist) {
  NanScope();
    if (args.Length() < 1) {
        NanThrowTypeError("Wrong number of arguments");
        NanReturnUndefined();
    }

    if (!args[0]->IsString() ) {
        NanThrowTypeError("Wrong arguments");
        NanReturnUndefined();
    }
    std::string word(*String::Utf8Value(args[0]->ToString()));

    NanReturnValue(root.exist(word));
}

void Init(Handle<Object> exports) {
  exports->Set(NanNew("add"), NanNew<FunctionTemplate>(Add)->GetFunction());
  exports->Set(NanNew("exist"), NanNew<FunctionTemplate>(Exist)->GetFunction());
  exports->Set(NanNew("clear"), NanNew<FunctionTemplate>(Clear)->GetFunction());
}

NODE_MODULE(WordTree, Init)
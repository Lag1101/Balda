#include <nan.h>

#include "WordTree.h"

using namespace v8;


WordTree wordTree;
NAN_METHOD(Clear) {
    NanScope();

    wordTree.clear();

    NanReturnUndefined();
}
NAN_METHOD(getEasyWordByLength) {
	NanScope();

	if (args.Length() < 1) {
		NanThrowTypeError("Wrong number of arguments");
		NanReturnUndefined();
	}
	if (!args[0]->IsUint32() ) {
		NanThrowTypeError("Wrong arguments");
		NanReturnUndefined();
	}

	size_t length = args[0]->Uint32Value();
	auto word = wordTree.getEasyWordByLength(length);

	NanReturnValue(word);
}
NAN_METHOD(CalcStats) {
	NanScope();

	wordTree.calcStats();

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
    wordTree.add(word);

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

    NanReturnValue(wordTree.exist(word));
}

void Init(Handle<Object> exports) {
  exports->Set(NanNew("add"), NanNew<FunctionTemplate>(Add)->GetFunction());
  exports->Set(NanNew("exist"), NanNew<FunctionTemplate>(Exist)->GetFunction());
  exports->Set(NanNew("clear"), NanNew<FunctionTemplate>(Clear)->GetFunction());
  exports->Set(NanNew("calcStats"), NanNew<FunctionTemplate>(CalcStats)->GetFunction());
  exports->Set(NanNew("getEasyWordByLength"), NanNew<FunctionTemplate>(getEasyWordByLength)->GetFunction());
}

NODE_MODULE(WordTree, Init)
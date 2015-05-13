#include <nan.h>

#include "WordTree.h"

#include <iostream>
#include <string>

using namespace v8;

WordTree wordTree;

NAN_METHOD(WordsCountWhichLengthGreaterThen) {
	NanScope();

	if (args.Length() < 1) {
		NanThrowTypeError("Wrong number of arguments");
		NanReturnUndefined();
	}
	if (!args[0]->IsUint32() ) {
		NanThrowTypeError("Wrong arguments");
		NanReturnUndefined();
	}

	auto length = args[0]->Uint32Value();
	auto count = wordTree.wordsCountWhichLengthGreaterThen(length);

	NanReturnValue(count);
}

NAN_METHOD(Clear) {
    NanScope();

    wordTree.clear();

    NanReturnUndefined();
}
NAN_METHOD(GetWordByLength) {
	NanScope();

	double start = 0.0,  end = 1.0;

	if (args.Length() < 1) {
		NanThrowTypeError("Wrong number of arguments");
		NanReturnUndefined();
	}
	if (!args[0]->IsUint32() ) {
		NanThrowTypeError("Wrong arguments");
		NanReturnUndefined();
	}
	if (args.Length() >= 3) {
		if (!args[1]->IsNumber() || !args[2]->IsNumber()) {
			NanThrowTypeError("Wrong arguments");
			NanReturnUndefined();
		}
		start = args[1]->NumberValue();
		end = args[2]->NumberValue();

		if(start < 0.0 || start > 1.0 || end <= start || end > 1.0){
			NanThrowTypeError("Wrong arguments");
			NanReturnUndefined();
		}
	}

	size_t length = args[0]->Uint32Value();
	auto word = wordTree.getWordByLength(2*length, start, end);
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

	String::Utf8Value utf(args[0]->ToString());
	std::string word = *utf;

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

	String::Utf8Value utf(args[0]->ToString());
	std::string word = *utf;

    NanReturnValue(wordTree.exist(word));
}

void Init(Handle<Object> exports) {
	exports->Set(NanNew("add"), NanNew<FunctionTemplate>(Add)->GetFunction());
	exports->Set(NanNew("exist"), NanNew<FunctionTemplate>(Exist)->GetFunction());
	exports->Set(NanNew("clear"), NanNew<FunctionTemplate>(Clear)->GetFunction());
	exports->Set(NanNew("calcStats"), NanNew<FunctionTemplate>(CalcStats)->GetFunction());
	exports->Set(NanNew("getWordByLength"), NanNew<FunctionTemplate>(GetWordByLength)->GetFunction());
	exports->Set(NanNew("wordsCountWhichLengthGreaterThen"), NanNew<FunctionTemplate>(WordsCountWhichLengthGreaterThen)->GetFunction());
}

NODE_MODULE(WordTree, Init)
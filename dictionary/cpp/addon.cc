#include <nan.h>

#include "WordTree.h"

#include <iostream>
#include <codecvt>
#include <string>

using namespace v8;

WordTree wordTree;

std::wstring s2ws(const std::string& str)
{
	typedef std::codecvt_utf16<wchar_t> convert_typeX;
	std::wstring_convert<convert_typeX, wchar_t> converterX;

	return converterX.from_bytes(str);
}

std::string ws2s(const std::wstring& str)
{
	typedef std::codecvt_utf16<wchar_t> convert_typeX;
	std::wstring_convert<convert_typeX, wchar_t> converterX;

	return converterX.to_bytes(str);
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

	try{
		size_t length = args[0]->Uint32Value();
		auto word = wordTree.getWordByLength(length, start, end);
		NanReturnValue(ws2s(word));
	}
	catch(const std::runtime_error & e)
	{
		std::cerr << e.what() << std::endl;
		NanThrowTypeError(e.what());
		NanReturnUndefined();
	}

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
	std::wstring word = s2ws(*utf);

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
	std::wstring word = s2ws(*utf);

    NanReturnValue(wordTree.exist(word));
}

void Init(Handle<Object> exports) {
  exports->Set(NanNew("add"), NanNew<FunctionTemplate>(Add)->GetFunction());
  exports->Set(NanNew("exist"), NanNew<FunctionTemplate>(Exist)->GetFunction());
  exports->Set(NanNew("clear"), NanNew<FunctionTemplate>(Clear)->GetFunction());
  exports->Set(NanNew("calcStats"), NanNew<FunctionTemplate>(CalcStats)->GetFunction());
  exports->Set(NanNew("getWordByLength"), NanNew<FunctionTemplate>(GetWordByLength)->GetFunction());
}

NODE_MODULE(WordTree, Init)
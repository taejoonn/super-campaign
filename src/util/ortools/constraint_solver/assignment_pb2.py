# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: ortools/constraint_solver/assignment.proto

import sys
_b=sys.version_info[0]<3 and (lambda x:x) or (lambda x:x.encode('latin1'))
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()




DESCRIPTOR = _descriptor.FileDescriptor(
  name='ortools/constraint_solver/assignment.proto',
  package='operations_research',
  syntax='proto3',
  serialized_options=None,
  serialized_pb=_b('\n*ortools/constraint_solver/assignment.proto\x12\x13operations_research\"L\n\x10IntVarAssignment\x12\x0e\n\x06var_id\x18\x01 \x01(\t\x12\x0b\n\x03min\x18\x02 \x01(\x03\x12\x0b\n\x03max\x18\x03 \x01(\x03\x12\x0e\n\x06\x61\x63tive\x18\x04 \x01(\x08\"\xd9\x01\n\x15IntervalVarAssignment\x12\x0e\n\x06var_id\x18\x01 \x01(\t\x12\x11\n\tstart_min\x18\x02 \x01(\x03\x12\x11\n\tstart_max\x18\x03 \x01(\x03\x12\x14\n\x0c\x64uration_min\x18\x04 \x01(\x03\x12\x14\n\x0c\x64uration_max\x18\x05 \x01(\x03\x12\x0f\n\x07\x65nd_min\x18\x06 \x01(\x03\x12\x0f\n\x07\x65nd_max\x18\x07 \x01(\x03\x12\x15\n\rperformed_min\x18\x08 \x01(\x03\x12\x15\n\rperformed_max\x18\t \x01(\x03\x12\x0e\n\x06\x61\x63tive\x18\n \x01(\x08\"\x81\x01\n\x15SequenceVarAssignment\x12\x0e\n\x06var_id\x18\x01 \x01(\t\x12\x18\n\x10\x66orward_sequence\x18\x02 \x03(\x05\x12\x19\n\x11\x62\x61\x63kward_sequence\x18\x03 \x03(\x05\x12\x13\n\x0bunperformed\x18\x04 \x03(\x05\x12\x0e\n\x06\x61\x63tive\x18\x05 \x01(\x08\",\n\nWorkerInfo\x12\x11\n\tworker_id\x18\x01 \x01(\x05\x12\x0b\n\x03\x62ns\x18\x02 \x01(\t\"\xf0\x02\n\x0f\x41ssignmentProto\x12\x41\n\x12int_var_assignment\x18\x01 \x03(\x0b\x32%.operations_research.IntVarAssignment\x12K\n\x17interval_var_assignment\x18\x02 \x03(\x0b\x32*.operations_research.IntervalVarAssignment\x12K\n\x17sequence_var_assignment\x18\x06 \x03(\x0b\x32*.operations_research.SequenceVarAssignment\x12\x38\n\tobjective\x18\x03 \x01(\x0b\x32%.operations_research.IntVarAssignment\x12\x34\n\x0bworker_info\x18\x04 \x01(\x0b\x32\x1f.operations_research.WorkerInfo\x12\x10\n\x08is_valid\x18\x05 \x01(\x08\x62\x06proto3')
)




_INTVARASSIGNMENT = _descriptor.Descriptor(
  name='IntVarAssignment',
  full_name='operations_research.IntVarAssignment',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='var_id', full_name='operations_research.IntVarAssignment.var_id', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='min', full_name='operations_research.IntVarAssignment.min', index=1,
      number=2, type=3, cpp_type=2, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='max', full_name='operations_research.IntVarAssignment.max', index=2,
      number=3, type=3, cpp_type=2, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='active', full_name='operations_research.IntVarAssignment.active', index=3,
      number=4, type=8, cpp_type=7, label=1,
      has_default_value=False, default_value=False,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=67,
  serialized_end=143,
)


_INTERVALVARASSIGNMENT = _descriptor.Descriptor(
  name='IntervalVarAssignment',
  full_name='operations_research.IntervalVarAssignment',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='var_id', full_name='operations_research.IntervalVarAssignment.var_id', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='start_min', full_name='operations_research.IntervalVarAssignment.start_min', index=1,
      number=2, type=3, cpp_type=2, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='start_max', full_name='operations_research.IntervalVarAssignment.start_max', index=2,
      number=3, type=3, cpp_type=2, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='duration_min', full_name='operations_research.IntervalVarAssignment.duration_min', index=3,
      number=4, type=3, cpp_type=2, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='duration_max', full_name='operations_research.IntervalVarAssignment.duration_max', index=4,
      number=5, type=3, cpp_type=2, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='end_min', full_name='operations_research.IntervalVarAssignment.end_min', index=5,
      number=6, type=3, cpp_type=2, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='end_max', full_name='operations_research.IntervalVarAssignment.end_max', index=6,
      number=7, type=3, cpp_type=2, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='performed_min', full_name='operations_research.IntervalVarAssignment.performed_min', index=7,
      number=8, type=3, cpp_type=2, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='performed_max', full_name='operations_research.IntervalVarAssignment.performed_max', index=8,
      number=9, type=3, cpp_type=2, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='active', full_name='operations_research.IntervalVarAssignment.active', index=9,
      number=10, type=8, cpp_type=7, label=1,
      has_default_value=False, default_value=False,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=146,
  serialized_end=363,
)


_SEQUENCEVARASSIGNMENT = _descriptor.Descriptor(
  name='SequenceVarAssignment',
  full_name='operations_research.SequenceVarAssignment',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='var_id', full_name='operations_research.SequenceVarAssignment.var_id', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='forward_sequence', full_name='operations_research.SequenceVarAssignment.forward_sequence', index=1,
      number=2, type=5, cpp_type=1, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='backward_sequence', full_name='operations_research.SequenceVarAssignment.backward_sequence', index=2,
      number=3, type=5, cpp_type=1, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='unperformed', full_name='operations_research.SequenceVarAssignment.unperformed', index=3,
      number=4, type=5, cpp_type=1, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='active', full_name='operations_research.SequenceVarAssignment.active', index=4,
      number=5, type=8, cpp_type=7, label=1,
      has_default_value=False, default_value=False,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=366,
  serialized_end=495,
)


_WORKERINFO = _descriptor.Descriptor(
  name='WorkerInfo',
  full_name='operations_research.WorkerInfo',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='worker_id', full_name='operations_research.WorkerInfo.worker_id', index=0,
      number=1, type=5, cpp_type=1, label=1,
      has_default_value=False, default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='bns', full_name='operations_research.WorkerInfo.bns', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=_b("").decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=497,
  serialized_end=541,
)


_ASSIGNMENTPROTO = _descriptor.Descriptor(
  name='AssignmentProto',
  full_name='operations_research.AssignmentProto',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  fields=[
    _descriptor.FieldDescriptor(
      name='int_var_assignment', full_name='operations_research.AssignmentProto.int_var_assignment', index=0,
      number=1, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='interval_var_assignment', full_name='operations_research.AssignmentProto.interval_var_assignment', index=1,
      number=2, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='sequence_var_assignment', full_name='operations_research.AssignmentProto.sequence_var_assignment', index=2,
      number=6, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='objective', full_name='operations_research.AssignmentProto.objective', index=3,
      number=3, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='worker_info', full_name='operations_research.AssignmentProto.worker_info', index=4,
      number=4, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
    _descriptor.FieldDescriptor(
      name='is_valid', full_name='operations_research.AssignmentProto.is_valid', index=5,
      number=5, type=8, cpp_type=7, label=1,
      has_default_value=False, default_value=False,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=544,
  serialized_end=912,
)

_ASSIGNMENTPROTO.fields_by_name['int_var_assignment'].message_type = _INTVARASSIGNMENT
_ASSIGNMENTPROTO.fields_by_name['interval_var_assignment'].message_type = _INTERVALVARASSIGNMENT
_ASSIGNMENTPROTO.fields_by_name['sequence_var_assignment'].message_type = _SEQUENCEVARASSIGNMENT
_ASSIGNMENTPROTO.fields_by_name['objective'].message_type = _INTVARASSIGNMENT
_ASSIGNMENTPROTO.fields_by_name['worker_info'].message_type = _WORKERINFO
DESCRIPTOR.message_types_by_name['IntVarAssignment'] = _INTVARASSIGNMENT
DESCRIPTOR.message_types_by_name['IntervalVarAssignment'] = _INTERVALVARASSIGNMENT
DESCRIPTOR.message_types_by_name['SequenceVarAssignment'] = _SEQUENCEVARASSIGNMENT
DESCRIPTOR.message_types_by_name['WorkerInfo'] = _WORKERINFO
DESCRIPTOR.message_types_by_name['AssignmentProto'] = _ASSIGNMENTPROTO
_sym_db.RegisterFileDescriptor(DESCRIPTOR)

IntVarAssignment = _reflection.GeneratedProtocolMessageType('IntVarAssignment', (_message.Message,), dict(
  DESCRIPTOR = _INTVARASSIGNMENT,
  __module__ = 'ortools.constraint_solver.assignment_pb2'
  # @@protoc_insertion_point(class_scope:operations_research.IntVarAssignment)
  ))
_sym_db.RegisterMessage(IntVarAssignment)

IntervalVarAssignment = _reflection.GeneratedProtocolMessageType('IntervalVarAssignment', (_message.Message,), dict(
  DESCRIPTOR = _INTERVALVARASSIGNMENT,
  __module__ = 'ortools.constraint_solver.assignment_pb2'
  # @@protoc_insertion_point(class_scope:operations_research.IntervalVarAssignment)
  ))
_sym_db.RegisterMessage(IntervalVarAssignment)

SequenceVarAssignment = _reflection.GeneratedProtocolMessageType('SequenceVarAssignment', (_message.Message,), dict(
  DESCRIPTOR = _SEQUENCEVARASSIGNMENT,
  __module__ = 'ortools.constraint_solver.assignment_pb2'
  # @@protoc_insertion_point(class_scope:operations_research.SequenceVarAssignment)
  ))
_sym_db.RegisterMessage(SequenceVarAssignment)

WorkerInfo = _reflection.GeneratedProtocolMessageType('WorkerInfo', (_message.Message,), dict(
  DESCRIPTOR = _WORKERINFO,
  __module__ = 'ortools.constraint_solver.assignment_pb2'
  # @@protoc_insertion_point(class_scope:operations_research.WorkerInfo)
  ))
_sym_db.RegisterMessage(WorkerInfo)

AssignmentProto = _reflection.GeneratedProtocolMessageType('AssignmentProto', (_message.Message,), dict(
  DESCRIPTOR = _ASSIGNMENTPROTO,
  __module__ = 'ortools.constraint_solver.assignment_pb2'
  # @@protoc_insertion_point(class_scope:operations_research.AssignmentProto)
  ))
_sym_db.RegisterMessage(AssignmentProto)


# @@protoc_insertion_point(module_scope)
